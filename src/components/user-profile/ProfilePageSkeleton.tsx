export function ProfilePageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Cover */}
      <div className="w-full rounded-2xl background h-[383px]" />

      <div className="profile-container">
        <div className="-mt-60">
          {/* Profile Header Card */}
          <div className="bg-white w-full rounded-2xl p-6 font-[manrope]">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-[213px] h-[213px] rounded-sm bg-gray-200" />

              <div className="flex-1 space-y-4">
                <div className="h-8 w-72 rounded-md bg-gray-200" />
                <div className="h-6 w-48 rounded-md bg-gray-100" />

                <div className="flex flex-wrap gap-6">
                  <div className="h-5 w-40 rounded-md bg-gray-100" />
                  <div className="h-5 w-36 rounded-md bg-gray-100" />
                  <div className="h-5 w-32 rounded-md bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full rounded-md bg-gray-100" />
                  <div className="h-4 w-5/6 rounded-md bg-gray-100" />
                </div>

                <div className="flex gap-8">
                  <div className="h-14 w-24 rounded-md bg-gray-100" />
                  <div className="h-14 w-24 rounded-md bg-gray-100" />
                </div>

                <div className="flex gap-3">
                  <div className="h-12 w-28 rounded-md bg-gray-200" />
                  <div className="h-12 w-28 rounded-md bg-gray-100" />
                </div>
              </div>
            </div>

            <div className="my-6 h-px bg-gray-100" />

            <div className="flex items-center gap-4">
              <div className="h-6 w-20 rounded-md bg-gray-200" />
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-11 w-11 rounded-md bg-gray-100" />
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 rounded-2xl bg-white p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-11 w-32 rounded-md bg-gray-100" />
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white border p-6 shadow-sm space-y-4"
            >
              <div className="h-6 w-44 rounded-md bg-gray-200" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded-md bg-gray-100" />
                <div className="h-4 w-5/6 rounded-md bg-gray-100" />
                <div className="h-4 w-2/3 rounded-md bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
