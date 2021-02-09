import {
  LineChartOutlined,
  BankOutlined,
  PercentageOutlined,
  BlockOutlined,
} from "@ant-design/icons";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type CategoryCopy = {
  cardColor: string;
  cardTitle: string;
  icon: ForwardRefExoticComponent<
    AntdIconProps & RefAttributes<HTMLSpanElement>
  >;
  description: string;
  cardTextColor?: string;
};

export const CATEGORIES: Record<string, CategoryCopy> = {
  volatility: {
    cardColor: "#2300F9",
    cardTitle: "Volatility",
    icon: LineChartOutlined,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat vestibulum lacus, id vulputate dolor venenatis vel. Donec sit amet libero tempus, ultricies ante quis, pharetra nisi. Nulla sed pharetra tortor. Nunc pulvinar erat ultrices nisl porttitor tristique ut consectetur urna. Ut maximus, dui non finibus bibendum, magna diam pellentesque neque, quis tincidunt leo tortor ut purus. Duis sed rutrum dolor. Nullam in justo at lacus dignissim varius a vitae felis. Nunc malesuada dapibus diam vitae viverra. Donec rutrum velit nec aliquet euismod. Quisque pulvinar, tortor sed elementum faucibus, orci ligula convallis orci, eget placerat mi libero sollicitudin lorem.",
  },
  "enhanced-yields": {
    cardColor: "#E91251",
    cardTitle: "Enhanced Yields",
    icon: PercentageOutlined,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat vestibulum lacus, id vulputate dolor venenatis vel. Donec sit amet libero tempus, ultricies ante quis, pharetra nisi. Nulla sed pharetra tortor. Nunc pulvinar erat ultrices nisl porttitor tristique ut consectetur urna. Ut maximus, dui non finibus bibendum, magna diam pellentesque neque, quis tincidunt leo tortor ut purus. Duis sed rutrum dolor. Nullam in justo at lacus dignissim varius a vitae felis. Nunc malesuada dapibus diam vitae viverra. Donec rutrum velit nec aliquet euismod. Quisque pulvinar, tortor sed elementum faucibus, orci ligula convallis orci, eget placerat mi libero sollicitudin lorem.",
  },
  "principal-protection": {
    cardColor: "#B1C9B6",
    cardTextColor: "inherit",
    cardTitle: "Principal Protection",
    icon: BankOutlined,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat vestibulum lacus, id vulputate dolor venenatis vel. Donec sit amet libero tempus, ultricies ante quis, pharetra nisi. Nulla sed pharetra tortor. Nunc pulvinar erat ultrices nisl porttitor tristique ut consectetur urna. Ut maximus, dui non finibus bibendum, magna diam pellentesque neque, quis tincidunt leo tortor ut purus. Duis sed rutrum dolor. Nullam in justo at lacus dignissim varius a vitae felis. Nunc malesuada dapibus diam vitae viverra. Donec rutrum velit nec aliquet euismod. Quisque pulvinar, tortor sed elementum faucibus, orci ligula convallis orci, eget placerat mi libero sollicitudin lorem.",
  },
  accumulation: {
    cardColor: "#5AB1DA",
    cardTitle: "Accumulation",
    icon: BlockOutlined,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat vestibulum lacus, id vulputate dolor venenatis vel. Donec sit amet libero tempus, ultricies ante quis, pharetra nisi. Nulla sed pharetra tortor. Nunc pulvinar erat ultrices nisl porttitor tristique ut consectetur urna. Ut maximus, dui non finibus bibendum, magna diam pellentesque neque, quis tincidunt leo tortor ut purus. Duis sed rutrum dolor. Nullam in justo at lacus dignissim varius a vitae felis. Nunc malesuada dapibus diam vitae viverra. Donec rutrum velit nec aliquet euismod. Quisque pulvinar, tortor sed elementum faucibus, orci ligula convallis orci, eget placerat mi libero sollicitudin lorem.",
  },
};
