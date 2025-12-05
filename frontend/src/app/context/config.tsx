import { createContext, type ParentComponent, useContext } from "solid-js";
import { type Config, create as createConfig } from "../../config";

interface ConfigContextType {
	config: Config;
}

const ConfigContext = createContext<ConfigContextType>();

export const ConfigProvider: ParentComponent = (props) => {
	// Config is synchronous (env-based). Create once per provider instance.
	const cfg = createConfig();

	return <ConfigContext.Provider value={{ config: cfg }}>{props.children}</ConfigContext.Provider>;
};

export const useConfig = () => {
	const ctx = useContext(ConfigContext);
	if (!ctx) throw new Error("useConfig must be used within a ConfigProvider");
	return ctx.config;
};
