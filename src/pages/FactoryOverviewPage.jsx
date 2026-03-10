import IconNavRail from '../components/factory/IconNavRail';
import TimelineBar from '../components/factory/TimelineBar';
import DataOverviewCard from '../components/factory/DataOverviewCard';
import FactoryMiniMap from '../components/factory/FactoryMiniMap';
import ProgressGauges from '../components/factory/ProgressGauges';
import DigitalTwinFloor from '../components/factory/DigitalTwinFloor';
import EquipmentMetricsChart from '../components/factory/EquipmentMetricsChart';
import UtilizationChart from '../components/factory/UtilizationChart';
import OEEChart from '../components/factory/OEEChart';
import ProductionBar from '../components/factory/ProductionBar';
import FloatingAlertBar from '../components/factory/FloatingAlertBar';

const FactoryOverviewPage = ({
  factoryData, alerts, stats, connected, getMachineHistory,
  production, oee, utilization, metrics, productionStats,
}) => {
  return (
    <div className="dt-dashboard">
      <IconNavRail activePage="dashboard" />
      <TimelineBar alerts={alerts} />

      <aside className="dt-left-panel">
        <DataOverviewCard stats={stats} factoryData={factoryData} />
        <FactoryMiniMap factoryData={factoryData} />
        <ProgressGauges production={production} />
      </aside>

      <main className="dt-center">
        <DigitalTwinFloor
          factoryData={factoryData}
          getMachineHistory={getMachineHistory}
        />
      </main>

      <aside className="dt-right-panel">
        <EquipmentMetricsChart data={metrics} />
        <UtilizationChart data={utilization} />
        <OEEChart data={oee} />
      </aside>

      <ProductionBar data={productionStats} />
      <FloatingAlertBar alerts={alerts} />
    </div>
  );
};

export default FactoryOverviewPage;
