import { Spinner } from "@ui/spinner";
import { Component, Suspense } from "solid-js";
import { Municipalities } from "../../features/municipalities/components/municipalities";

export const MunicipalitiesPage: Component = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <p class="py-6">
        Questa è la lista completa dei comuni supportati da TVTrash.
      </p>
      <Municipalities />
    </Suspense>
  );
};
