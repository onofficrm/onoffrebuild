import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex gap-2 relative max-w-lg mx-auto">
        <a href="tel:0503-6982-1200" className="flex-1 flex items-center justify-center py-3.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-sm">
           <Phone size={16} className="mr-2" />
           전화상담
        </a>
        <Link to="/consult" className="flex-1 flex items-center justify-center py-3.5 bg-blue-900 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-900/20">
           무료상담
        </Link>
      </div>
    </div>
  );
}
