import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Droplets, 
  Power, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

const StatusCards = ({ systemData, onDeviceToggle }) => {
  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const devices = [
    {
      id: 'vana1Durum',
      title: 'Vana 1',
      icon: <Droplets className="h-5 w-5" />,
      controllable: true
    },
    {
      id: 'vana2Durum',
      title: 'Vana 2',
      icon: <Droplets className="h-5 w-5" />,
      controllable: true
    },
    {
      id: 'hidroforDurum',
      title: 'Hidrofor',
      icon: <Power className="h-5 w-5" />,
      controllable: true
    },
    {
      id: 'artezyenDurum',
      title: 'Artezyen',
      icon: <Zap className="h-5 w-5" />,
      controllable: false
    }
  ];

  const alarms = [
    {
      id: 'acilDurum',
      title: 'Acil Durum',
      active: systemData.acilDurum
    },
    {
      id: 'alarmSuBitti',
      title: 'Su Bitti',
      active: systemData.alarmSuBitti
    },
    {
      id: 'alarmTasma',
      title: 'Taşma',
      active: systemData.alarmTasma
    },
    {
      id: 'buzzerUyariAcik',
      title: 'Buzzer',
      active: systemData.buzzerUyariAcik
    }
  ];

  return (
    <div className="space-y-6">
      {/* Cihaz Durumları */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Cihaz Durumları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device) => {
            const isActive = systemData[device.id];
            return (
              <Card key={device.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(isActive)}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {device.title}
                  </CardTitle>
                  {device.icon}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(isActive)}
                      <span className="text-sm font-medium">
                        {isActive ? 'Açık' : 'Kapalı'}
                      </span>
                    </div>
                    {device.controllable && (
                      <Button
                        size="sm"
                        variant={isActive ? "destructive" : "default"}
                        onClick={() => onDeviceToggle(device.id, isActive)}
                        className="text-xs"
                      >
                        {isActive ? 'Kapat' : 'Aç'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Alarm Durumları */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Alarm Durumları
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {alarms.map((alarm) => (
                <div key={alarm.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{alarm.title}</span>
                  <Badge 
                    variant={alarm.active ? "destructive" : "secondary"}
                    className="ml-2"
                  >
                    {alarm.active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusCards;

