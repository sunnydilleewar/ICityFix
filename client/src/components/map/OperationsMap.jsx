import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import CategoryBadge, { CATEGORY_INFO } from '../common/CategoryBadge';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';

const createCustomIcon = (category, status, priority) => {
  const catColor = CATEGORY_INFO[category]?.color || '#0270C7';
  const isUrgent = priority === 'URGENT';

  return L.divIcon({
    className: 'custom-civic-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        background-color: ${catColor};
        border-radius: 50%;
        border: 2.5px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        color: white;
        cursor: pointer;
        transition: transform 0.15s ease;
      ">
        ${isUrgent ? '<div style="position: absolute; top: -4px; right: -4px; width: 10px; height: 10px; background: #EF4444; border-radius: 50%; border: 1.5px solid white;"></div>' : ''}
        <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

export default function OperationsMap({ reports = [], height = '550px', isAdmin = false }) {
  const defaultCenter = [12.9716, 77.6412]; // Bengaluru center

  return (
    <div
      style={{ height }}
      className="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm"
    >
      <MapContainer
        center={
          reports.length > 0 && reports[0].location?.coordinates
            ? [reports[0].location.coordinates[1], reports[0].location.coordinates[0]]
            : defaultCenter
        }
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => {
          if (
            !report.location ||
            !report.location.coordinates ||
            report.location.coordinates.length < 2
          ) {
            return null;
          }

          const [lng, lat] = report.location.coordinates;

          return (
            <Marker
              key={report._id || report.reportId}
              position={[lat, lng]}
              icon={createCustomIcon(report.category, report.status, report.priority)}
            >
              <Popup>
                <div className="p-3 max-w-xs sm:max-w-sm">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-civic-700">
                      {report.reportId}
                    </span>
                    <PriorityBadge priority={report.priority} />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {report.title}
                  </h4>

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={report.status} size="xs" />
                    <CategoryBadge category={report.category} short={true} />
                  </div>

                  <div className="mt-2.5 flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <MapPin className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{report.address || report.ward}</span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                    <Link
                      to={isAdmin ? `/admin/reports/${report.reportId}` : `/reports/${report.reportId}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-civic-600 hover:text-civic-800"
                    >
                      View Report
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
