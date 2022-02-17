export interface AppState {
    [key: string]: ModuleState
}

export interface ModuleState {
    moduleName: string;
    moduleData: any;
    components: ComponentState[];
}

export interface ComponentState {
    name: string;
    data: any;
}