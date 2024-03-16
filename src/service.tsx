import { Context, createContext, ParentProps, useContext } from "solid-js";
import { AppService } from "./services/app-service";

const AppServiceContext = createContext<AppService>() as Context<AppService>;

export function ServiceProvider(props: ParentProps) {
  let service = new AppService();

  return (
    <AppServiceContext.Provider value={service}>
      {props.children}
    </AppServiceContext.Provider>
  );
}

export function useService(): AppService {
  return useContext(AppServiceContext);
}
