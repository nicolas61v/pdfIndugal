'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, ArrowRight, Wrench } from 'lucide-react';

const InvoiceSelector = ({ onSelectCold }) => {
  const [timeLeft, setTimeLeft] = useState(28 * 24 * 60 * 60 * 1000); // 28 days in milliseconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (milliseconds) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const time = formatTime(timeLeft);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative w-64 h-24 mx-auto mb-6">
            <Image
              src="/images/LOGO INDUGAL(1).png"
              alt="Logo Indugal"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-400 mb-4">
            Sistema de Facturación Empresarial
          </h1>
          <p className="text-slate-400 text-lg">
            Selecciona el tipo de facturación que deseas utilizar
          </p>
        </div>

        {/* Invoice Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Cold Invoice Card - Enabled */}
          <div 
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
            onClick={onSelectCold}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="relative w-12 h-12">
                    <Image
                      src="/images/LOGO INDUGAL(1).png"
                      alt="Logo Indugal"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-blue-400 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                Indugal-Vanizados Industriales
              </h3>
              <p className="text-blue-400 font-medium mb-4">
                También conocido como "Frío"
              </p>
              
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-green-400 font-medium">Sistema Activo</span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                Sistema de facturación completo para procesos industriales y galvanizados. 
                Incluye generación automática de documentos, control de consecutivos y gestión de productos.
              </p>
            </div>
          </div>

          {/* Hot Invoice Card - Disabled */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px] z-10"></div>
            
            <div className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Wrench className="h-8 w-8 text-orange-400" />
                </div>
                <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg px-3 py-1">
                  <span className="text-orange-400 text-sm font-medium">En Desarrollo</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-300 mb-3">
                Industrias y Galvanizados del Aburrá
              </h3>
              <p className="text-orange-400 font-medium mb-4">
                También conocido como "Caliente"
              </p>
              
              {/* Countdown Timer */}
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-3">
                  <Clock className="h-4 w-4 text-orange-400 mr-2" />
                  <span className="text-orange-400 text-sm font-medium">Tiempo estimado de lanzamiento</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-orange-400 text-xl font-bold">{time.days}</div>
                    <div className="text-slate-400 text-xs">Días</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-orange-400 text-xl font-bold">{time.hours}</div>
                    <div className="text-slate-400 text-xs">Horas</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-orange-400 text-xl font-bold">{time.minutes}</div>
                    <div className="text-slate-400 text-xs">Min</div>
                  </div>
                  <div className="bg-slate-800/50 rounded p-2">
                    <div className="text-orange-400 text-xl font-bold">{time.seconds}</div>
                    <div className="text-slate-400 text-xs">Seg</div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm leading-relaxed">
                Sistema de facturación en desarrollo para procesos de alta temperatura. 
                Próximamente disponible con funcionalidades avanzadas y nueva interfaz.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">
              ¿Necesitas ayuda?
            </h4>
            <p className="text-slate-400 text-sm">
              Si tienes dudas sobre qué tipo de facturación usar, contacta con el equipo de soporte técnico. 
              Cada sistema está optimizado para diferentes tipos de procesos industriales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSelector;