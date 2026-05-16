'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center animate-fadeIn">
        <div className="text-8xl mb-4">⚠️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Error</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Algo salió mal
        </h2>
        <p className="text-gray-500 mb-6">
          Ha ocurrido un error inesperado. Por favor, intente nuevamente.
        </p>
        <button onClick={reset} className="btn-primary">
          Reintentar
        </button>
      </div>
    </div>
  );
}