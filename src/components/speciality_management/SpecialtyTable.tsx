'use client';

import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Loader2,
  Search,
  Trash2,
} from 'lucide-react';

import type { Specialty } from './SpecialtyFormModal';

interface SpecialtyTableProps {
  specialties: Specialty[];
  isLoading: boolean;

  searchText: string;
  statusFilter: 'all' | 'active' | 'inactive';

  totalCount: number;
  currentPage: number;
  totalPage: number;

  deletingId: string | null;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: 'all' | 'active' | 'inactive') => void;

  onView: (specialty: Specialty) => void;
  onEdit: (specialty: Specialty) => void;
  onDelete: (id: string) => void;

  onPreviousPage: () => void;
  onNextPage: () => void;
}

export default function SpecialtyTable({
  specialties,
  isLoading,
  searchText,
  statusFilter,
  totalCount,
  currentPage,
  totalPage,
  deletingId,
  onSearchChange,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
  onPreviousPage,
  onNextPage,
}: SpecialtyTableProps) {
  const filteredSpecialties = specialties.filter(specialty => {
    if (statusFilter === 'active') {
      return specialty.is_active !== false;
    }

    if (statusFilter === 'inactive') {
      return specialty.is_active === false;
    }

    return true;
  });

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />

            <input
              type="text"
              value={searchText}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search specialties..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01503b]/30 focus:border-[#01503b]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={e =>
                onStatusChange(e.target.value as 'all' | 'active' | 'inactive')
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01503b]/30 focus:border-[#01503b] bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <span className="text-sm text-gray-500 whitespace-nowrap">
              {totalCount} total
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e]">
                  Name
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e]">
                  Topics
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e]">
                  Status
                </th>

                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e] text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10">
                    <div className="flex justify-center">
                      <Loader2
                        className="animate-spin text-gray-400"
                        size={28}
                      />
                    </div>
                  </td>
                </tr>
              ) : filteredSpecialties.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No specialties found.
                  </td>
                </tr>
              ) : (
                filteredSpecialties.map(specialty => {
                  const id = specialty.id || specialty._id || '';

                  const topicCount =
                    specialty.total_topics ?? specialty.topics?.length ?? 0;

                  const isActive = specialty.is_active !== false;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-[#fbfcfb] transition-colors animate-row-fade-in"
                    >
                      <td className="px-6 py-4 font-medium text-[#01281e]">
                        {specialty.name}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {topicCount} Topic
                        {topicCount !== 1 ? 's' : ''}
                      </td>

                      <td className="px-6 py-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#01503b]/10 text-[#01503b] text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#01503b]" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onView(specialty)}
                            className="p-2 rounded-lg text-[#01503b] hover:bg-[#01503b]/10 transition cursor-pointer"
                            title="View details"
                          >
                            <Eye size={17} />
                          </button>

                          {/* <button
                            type="button"
                            onClick={() => onEdit(specialty)}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={17} />
                          </button> */}

                          <button
                            type="button"
                            disabled={deletingId === id || !id}
                            onClick={() => onDelete(id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            {deletingId === id ? (
                              <Loader2 className="animate-spin" size={17} />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPage > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Page {currentPage} of {totalPage} • {totalCount} total
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={currentPage <= 1 || isLoading}
                className="p-2 rounded-lg text-[#01503b] hover:bg-[#01503b]/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Previous page"
              >
                <ChevronLeft size={17} />
              </button>

              <span className="px-2 py-1 text-xs font-medium text-[#01281e]">
                {currentPage}
              </span>

              <button
                type="button"
                onClick={onNextPage}
                disabled={currentPage >= totalPage || isLoading}
                className="p-2 rounded-lg text-[#01503b] hover:bg-[#01503b]/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Next page"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
