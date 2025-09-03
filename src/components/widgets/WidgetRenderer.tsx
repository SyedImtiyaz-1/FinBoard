import React from 'react';
import { Widget } from '../../stores/dashboardStore';
import TableWidget from './Table/TableWidget';
import FinanceCard from './FinanceCard/FinanceCard';
import ChartWidget from './Chart/ChartWidget';

interface WidgetRendererProps {
  widget: Widget;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget }) => {
  const renderWidget = () => {
    switch (widget.displayMode) {
      case 'table':
        return <TableWidget widget={widget} />;
      case 'card':
        return <FinanceCard widget={widget} />;
      case 'chart':
        return <ChartWidget widget={widget} />;
      default:
        return <FinanceCard widget={widget} />;
    }
  };

  return renderWidget();
};

export default WidgetRenderer;

