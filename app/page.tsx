import Link from "next/link";
import { Database, Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Kalkulator Budget Ketidakpastian
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Aplikasi untuk mengelola database instrumen kalibrasi dan
            menghitung budget ketidakpastian pengukuran
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/database"
            className="group block p-8 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Database className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Database Instrumen</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola database instrumen kalibrasi termasuk nama, brand,
              tipe/model, nomor seri, besaran ukur, rentang ukur, drift, dan
              CMC.
            </p>
          </Link>

          <Link
            href="/calculator"
            className="group block p-8 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors">
                <Calculator className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">
                Kalkulator Budget Ketidakpastian
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Hitung budget ketidakpastian pengukuran dengan template yang dapat
              disesuaikan untuk setiap besaran ukur dan rentang pengukuran.
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <h3 className="text-xl font-bold mb-3">Fitur Utama</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>✓ Database instrumen dengan CRUD lengkap</li>
            <li>✓ Kalkulator budget ketidakpastian otomatis</li>
            <li>✓ Template yang dapat disesuaikan</li>
            <li>✓ Penyimpanan lokal di browser</li>
            <li>✓ Mode terang dan gelap</li>
            <li>✓ Antarmuka dalam bahasa Indonesia</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
