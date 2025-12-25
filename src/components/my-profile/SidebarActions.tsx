import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

export default function SidebarActions() {
  return (
    <div className="bg-green-600 rounded-2xl p-6 space-y-3">
      <Button className="w-full bg-white text-green-600">
        <Download className="mr-2 h-4 w-4" /> Download CV
      </Button>
      <Button variant="outline" className="w-full text-white border-white">
        <Share2 className="mr-2 h-4 w-4" /> Share Profile
      </Button>
    </div>
  );
}
