import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Calendar, Clock, Droplets, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const LogsTable = ({ logs }) => {
  const getStatusBadge = (value, type) => {
    if (type === 'water') {
      if (value >= 80) return <Badge className="bg-blue-500">Yüksek</Badge>;
      if (value >= 50) return <Badge className="bg-green-500">Normal</Badge>;
      if (value >= 20) return <Badge className="bg-yellow-500">Düşük</Badge>;
      return <Badge className="bg-red-500">Kritik</Badge>;
    }
    
    if (type === 'soil') {
      if (value >= 70) return <Badge className="bg-green-500">Optimal</Badge>;
      if (value >= 40) return <Badge className="bg-yellow-500">Orta</Badge>;
      return <Badge className="bg-red-500">Düşük</Badge>;
    }
    
    return null;
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy', { locale: tr });
    } catch {
      return dateString;
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Son Kayıtlar</CardTitle>
          <FileText className="h-4 w-4 ml-auto text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Henüz log kaydı bulunmuyor</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Son Kayıtlar ({logs.length})
        </CardTitle>
        <FileText className="h-4 w-4 ml-auto text-gray-500" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Tarih</span>
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Saat</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Su Litre</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <span>Su %</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Thermometer className="h-4 w-4 text-green-500" />
                    <span>Toprak Nem</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {formatDate(log.date)}
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {formatTime(log.time)}
                    </code>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium">{log.suLitresi || 0}</span>
                      <span className="text-xs text-gray-500">L</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="font-medium">{log.suYuzdesi || 0}%</span>
                      {getStatusBadge(log.suYuzdesi || 0, 'water')}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className="font-medium">{log.toprakNem || 0}%</span>
                      {getStatusBadge(log.toprakNem || 0, 'soil')}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-1">
                      {(log.suYuzdesi || 0) < 20 && (
                        <Badge variant="destructive" className="text-xs">
                          Su Düşük
                        </Badge>
                      )}
                      {(log.toprakNem || 0) < 30 && (
                        <Badge variant="outline" className="text-xs">
                          Nem Düşük
                        </Badge>
                      )}
                      {(log.suYuzdesi || 0) >= 50 && (log.toprakNem || 0) >= 50 && (
                        <Badge className="bg-green-500 text-xs">
                          Normal
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        {/* Özet İstatistikler */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Ortalama Su %</p>
              <p className="text-lg font-semibold text-blue-600">
                {logs.length > 0 
                  ? Math.round(logs.reduce((sum, log) => sum + (log.suYuzdesi || 0), 0) / logs.length)
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ortalama Nem %</p>
              <p className="text-lg font-semibold text-green-600">
                {logs.length > 0 
                  ? Math.round(logs.reduce((sum, log) => sum + (log.toprakNem || 0), 0) / logs.length)
                  : 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Toplam Kayıt</p>
              <p className="text-lg font-semibold text-gray-600">
                {logs.length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsTable;

