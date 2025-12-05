import { createContext, type ParentComponent, useContext } from "solid-js";
import { create as createSupabase, type Client as SupabaseClient } from "../../supabase";
import { useConfig } from "./config";

interface SupabaseContextType {
	client: SupabaseClient;
}

const SupabaseContext = createContext<SupabaseContextType>();

export const SupabaseProvider: ParentComponent = (props) => {
	const config = useConfig();
	const client = createSupabase(config.supabase);

	return <SupabaseContext.Provider value={{ client }}>{props.children}</SupabaseContext.Provider>;
};

export const useSupabase = () => {
	const ctx = useContext(SupabaseContext);
	if (!ctx) throw new Error("useSupabase must be used within a SupabaseProvider");
	return ctx.client;
};
