

export default function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 p-4 border-b bg-white rounded-t-2xl">
        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-200 rounded-full" />
          <div className="h-3 w-24 bg-gray-100 rounded-full" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 p-6 space-y-5 overflow-hidden bg-white">
        {/* Incoming message */}
        <div className="flex items-end gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-10 w-48 bg-gray-200 rounded-2xl rounded-bl-none" />
            <div className="h-3 w-16 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex items-end gap-3 justify-end">
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-10 w-64 bg-green-100 rounded-2xl rounded-br-none" />
            <div className="h-3 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
        </div>

        {/* Incoming message */}
        <div className="flex items-end gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-10 w-72 bg-gray-200 rounded-2xl rounded-bl-none" />
            <div className="h-3 w-16 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex items-end gap-3 justify-end">
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-10 w-40 bg-green-100 rounded-2xl rounded-br-none" />
            <div className="h-3 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
        </div>

        {/* Incoming long message */}
        <div className="flex items-end gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
          <div className="space-y-1">
            <div className="h-20 w-80 bg-gray-200 rounded-2xl rounded-bl-none" />
            <div className="h-3 w-16 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>

      {/* Input skeleton */}
      <div className="p-4 border-t bg-white rounded-b-2xl flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 h-12 bg-gray-100 rounded-full" />
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
