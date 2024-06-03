import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  ChartDataset,
  ScatterDataPoint,
  ChartOptions,
  Tooltip,
  Filler,
} from "chart.js";
import "chartjs-adapter-luxon";
import { Line } from "react-chartjs-2";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { DateDropdown } from "../Dropdown/DateDropdown";
import {
  formatToISODate,
  getDatesBetween,
  getOptionDates,
} from "@utils/datetime";
import { MS_PER_DAY } from "@constants";
import { usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { ReportData } from "@api/types";
import "./style.css";

type Colors = "blue" | "green";

ChartJS.register(
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Title,
  Tooltip,
  Filler
);

interface ColorValues {
  solid: string;
  gradient: (context: CanvasRenderingContext2D) => CanvasGradient;
}

const COLORS: Record<Colors, ColorValues> = {
  blue: {
    solid: "rgb(94, 59, 221)",
    gradient: (context: CanvasRenderingContext2D) => {
      const gradient = context.createLinearGradient(0, 0, 0, 180);
      gradient.addColorStop(0, "rgba(94, 59, 221, 0.3)");
      gradient.addColorStop(1, "rgba(217, 217, 217, 0)");
      return gradient;
    },
  },
  green: {
    solid: "rgb(44, 216, 197)",
    gradient: (context: CanvasRenderingContext2D) => {
      const gradient = context.createLinearGradient(0, 0, 0, 180);
      gradient.addColorStop(0, "rgba(44, 216, 197, 0.3)");
      gradient.addColorStop(1, "rgba(217, 217, 217, 0)");
      return gradient;
    },
  },
};

function getDataTypeAxisType(
  dataType: TimeSeriesDataType,
  isBlueMetric: boolean
): "countBlue" | "countGreen" | "moneyBlue" | "moneyGreen" {
  switch (dataType) {
    case "clicks":
    case "impressions":
    case "roas":
    case "ctr":
    case "chargedImpressions":
    case "totalClicks":
      return isBlueMetric ? "countBlue" : "countGreen";
    case "spend":
    case "sales":
    case "cpc":
    case "cpm":
    case "adSpentImpressions":
      return isBlueMetric ? "moneyBlue" : "moneyGreen";
  }
}

function getDataTypeLabel(dataType: TimeSeriesDataType): string {
  switch (dataType) {
    case "spend":
    case "adSpentImpressions":
      return "Spend";
    case "clicks":
    case "totalClicks":
      return "Clicks";
    case "impressions":
      return "Impressions";
    case "sales":
      return "Sales";
    case "cpc":
      return "CPC";
    case "roas":
      return "ROAS";
    case "ctr":
      return "CTR";
    case "cpm":
      return "CPM";
    case "chargedImpressions":
      return "Charged-impressions";
  }
}

function generateDataset(
  dataType: TimeSeriesDataType,
  data: DataPoint[],
  context: CanvasRenderingContext2D,
  label: string,
  isBlueMetric: boolean
): ChartDataset<"line", ScatterDataPoint[] | number[] | null[]> {
  const { solid, gradient } = isBlueMetric ? COLORS.blue : COLORS.green;
  return {
    label,
    data: data.map((datum) => datum.y),
    cubicInterpolationMode: "monotone",
    yAxisID: getDataTypeAxisType(dataType, isBlueMetric),
    backgroundColor: gradient(context),
    fill: true,
    borderColor: solid,
    pointBackgroundColor: solid,
    borderWidth: 2,
    pointRadius: 2,
  };
}

function generateData(
  chart: ChartJSOrUndefined,
  rawDataSets: ReportTimeSeries[],
  blueMetric: TimeSeriesDataType
) {
  if (!chart || !rawDataSets.length) {
    return { datasets: [] };
  }
  return {
    labels: rawDataSets[0].data.map((datum) => datum.x),
    datasets:
      rawDataSets.length > 0
        ? rawDataSets.map(({ type, data }) =>
            generateDataset(
              type,
              data,
              chart.ctx,
              getDataTypeLabel(type),
              type == blueMetric
            )
          )
        : [],
  };
}

function generateOptions(
  xAxisTitle: string,
  currencyBuilder: (value: number) => string,
  yAxisIds: string[]
): ChartOptions<"line"> {
  const moneyWithPosition = (
    position: "left" | "right",
    drawOnChartArea: boolean
  ) => {
    return {
      type: "linear",
      position,
      grid: {
        color: "rgb(229, 231, 235)",
        drawBorder: false,
        drawOnChartArea,
      },
      beginAtZero: true,
      ticks: {
        maxTicksLimit: 6,
        padding: 12,
        callback: currencyBuilder,
      },
    };
  };

  const countWithPosition = (
    position: "left" | "right",
    drawOnChartArea: boolean
  ) => {
    return {
      position,
      grid: {
        color: "rgb(229, 231, 235)",
        drawBorder: false,
        drawOnChartArea,
      },
      beginAtZero: true,
      ticks: {
        maxTicksLimit: 6,
        padding: 12,
      },
    };
  };

  interface ScaleOption {
    [key: string]: any;
  }

  const scales: ScaleOption = {
    x: {
      type: "time",
      distribution: "series",
      time: {
        unit: "day",
        displayFormats: {
          day: "d",
        },
        tooltipFormat: "dd-MM-yyyy",
      },
      title: {
        display: true,
        text: xAxisTitle,
      },
      grid: {
        display: false,
      },
    },
  };

  if (yAxisIds[0].includes("money")) {
    scales.moneyBlue = moneyWithPosition("left", true);
  } else {
    scales.countBlue = countWithPosition("left", true);
  }

  if (yAxisIds[1] && yAxisIds[1].includes("money")) {
    scales.moneyGreen = moneyWithPosition("right", false);
  } else {
    scales.countGreen = countWithPosition("right", false);
  }
  return {
    maintainAspectRatio: false,
    scales,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        titleColor: "rgba(255, 255, 255, 0.7)",
        mode: "index",
        intersect: false,
        titleFont: { weight: "500" as any, size: 10 }, // TODO: type this
        bodyFont: { weight: "500" as any, size: 10 }, // TODO: type this
        bodyAlign: "left",
        bodySpacing: 8,
        backgroundColor: "rgba(39, 42, 71, 1)",
        padding: 8,
        caretSize: 0,
        borderWidth: 0,
        boxWidth: 8,
        boxHeight: 8,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label;

            if (!label) return "";

            let value;
            switch (context.dataset.yAxisID) {
              case "moneyBlue":
              case "moneyGreen":
                value = currencyBuilder(context.parsed.y);
                break;
              default:
                value = context.parsed.y;
                break;
            }

            return ` ${label}: ${value}`;
          },
        },
      },
    },
  };
}

function getXLabelFromDataFrame(endDate: Date, dayOffSet: number) {
  const months: Set<string> = new Set();
  const nextDate = new Date(endDate);
  months.add(
    endDate.toLocaleString("En", {
      month: "long",
    })
  );
  for (let i = 0; i < dayOffSet - 1; ++i) {
    months.add(
      new Date(nextDate.setDate(nextDate.getDate() - 1)).toLocaleString("En", {
        month: "long",
      })
    );
  }
  return Array.from(months).reverse().join(" - ");
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}
type TimeSeriesDataType =
  | "spend"
  | "clicks"
  | "impressions"
  | "sales"
  | "cpc"
  | "roas"
  | "ctr"
  | "cpm"
  | "adSpentImpressions"
  | "chargedImpressions"
  | "totalClicks";

type DataPoint = { x: string; y: number };
interface ReportTimeSeries {
  type: TimeSeriesDataType;
  data: { x: string; y: number }[];
}

export const SalesClicksChart: FunctionalComponent<{
  campaignId: string;
}> = ({ campaignId }) => {
  const chartDataTypes = [
    {
      dataType: "sales" as TimeSeriesDataType,
      reportPath: (report: ReportData) => {
        return report.purchases.amount;
      },
    },
    {
      dataType: "clicks" as TimeSeriesDataType,
      reportPath: (report: ReportData) => {
        return report.clicks.total;
      },
    },
  ];
  return (
    <CampaignChart campaignId={campaignId} chartDataTypes={chartDataTypes} />
  );
};

const CampaignChart: FunctionalComponent<{
  campaignId: string;
  chartDataTypes: {
    dataType: TimeSeriesDataType;
    reportPath: (report: ReportData) => number;
  }[];
}> = ({ campaignId, chartDataTypes }) => {
  const { authToken, centralServicesUrl } = usePromotionContext();
  const [dateRange, setDataFrame] = useState<DateRange>(
    getOptionDates("last-7-days")
  );
  const [reportTimeSeries, setReportTimeSeries] = useState<ReportTimeSeries[]>(
    []
  );

  useEffect(() => {
    const setChartData = async () => {
      const reports = await services.getCampaignDailyReport(
        centralServicesUrl,
        authToken,
        campaignId,
        dateRange.startDate,
        dateRange.endDate
      );
      const datesBetweeen = getDatesBetween(
        dateRange.startDate,
        dateRange.endDate
      );
      const dictionary = Object.fromEntries(
        reports.reports.map(({ date, ...rest }) => [date, rest])
      );
      chartDataTypes.forEach((chartType) => {
        const data = datesBetweeen.map((date) => {
          const strDate = formatToISODate(date);
          const dateReport = dictionary[strDate];
          return {
            x: strDate,
            y: dateReport ? chartType.reportPath(dateReport) : 0,
          };
        });
        setReportTimeSeries((prevState) => [
          ...prevState.filter((data) => data.type !== chartType.dataType),
          { type: chartType.dataType, data },
        ]);
      });
    };
    setChartData();
  }, [
    authToken,
    campaignId,
    centralServicesUrl,
    chartDataTypes,
    dateRange.endDate,
    dateRange.startDate,
  ]);
  const blueMetric = chartDataTypes[0].dataType;
  const greenMetric = chartDataTypes[1]?.dataType;

  return (
    <MetricsChart
      reportTimeSeries={reportTimeSeries}
      dateRange={dateRange}
      setDataFrame={setDataFrame}
      blueMetric={blueMetric}
      greenMetric={greenMetric}
    />
  );
};

const MetricsChart: FunctionalComponent<{
  reportTimeSeries: ReportTimeSeries[];
  dateRange: DateRange;
  setDataFrame: (dateRange: DateRange) => void;
  blueMetric: TimeSeriesDataType;
  greenMetric?: TimeSeriesDataType;
}> = ({
  reportTimeSeries,
  dateRange,
  setDataFrame,
  blueMetric,
  greenMetric,
}) => {
  const { formatMoney } = usePromotionContext();

  const chartRef = useRef<any>(undefined);
  const [chartData, setChartData] = useState<{
    datasets: ChartDataset<"line", ScatterDataPoint[] | number[] | null[]>[];
  }>({
    datasets: [],
  });

  useEffect(() => {
    if (reportTimeSeries) {
      setChartData(
        generateData(chartRef.current, reportTimeSeries, blueMetric)
      );
    }
  }, [blueMetric, reportTimeSeries]);

  const daysOffset =
    (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / MS_PER_DAY;

  return (
    <div className="ts-metrics-chart-wrapper">
      <div className="ts-chart-date-dropdown">
        <DateDropdown
          onOptionSelected={(startDate, endDate) =>
            setDataFrame({ startDate, endDate })
          }
        />
      </div>
      <div>
        <Line
          ref={chartRef}
          data={chartData}
          options={generateOptions(
            getXLabelFromDataFrame(dateRange?.endDate, daysOffset),
            formatMoney,
            [
              getDataTypeAxisType(blueMetric, true),
              ...(greenMetric ? [getDataTypeAxisType(greenMetric, false)] : []),
            ]
          )}
        />
      </div>
    </div>
  );
};
