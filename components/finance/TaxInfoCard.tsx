
import { FileText } from 'lucide-react'

export function TaxInfoCard() {
    return (
        <div className="mb-10">
            <h3 className="font-black text-slate-900 text-lg mb-6">Tax Information</h3>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-600 text-sm">
                        Form W-9 (Required for US-based earners)
                    </p>
                </div>
                <button className="text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors">
                    Manage Tax Forms
                </button>
            </div>
        </div>
    )
}
