import { Spinner } from "@ui/spinner";
import { Component, Suspense } from "solid-js";
import { Municipalities } from "../../features/municipalities/components/municipalities";

export const MunicipalitiesPage: Component = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <div>
        <h1 class="text-3xl font-bold">Municipalities</h1>
        <p class="opacity-60 mt-1 mb-3">
          List of municipalities supported by TVTrash
        </p>
      </div>
      <Municipalities/>
    </Suspense>
  );
};
