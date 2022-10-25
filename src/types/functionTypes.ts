export type GameStatusList = 'init' | 'move' | 'pause' | 'fail' | 'win' | 'settings' | 'restart';

export interface SoundList {
    eat: HTMLAudioElement;
    fail: HTMLAudioElement;
    win: HTMLAudioElement;
    pause: HTMLAudioElement;
}

export interface BaseSizes {
    cellSize: number;
    activeHeight: number;
    activeWidth: number;
    cellQuantity: number;
}

export interface Point {
    x: number,
    y: number,
}

// один сегмент змейки
export interface SnakeSlice extends Point {
    color: string
}

// один кубик еды
export interface FoodOne extends Point {
    // хранит цвет квадратика
    i: string,
    // хранит цвет границ квадратика
    j: string
}

// один блок барьера(состоит из нескольких кубиков)
export type BarrierUnit = Point[];


export interface BoxStyles {
    width: number,
    height: number,
    top: number,
    left: number,
    backgroundColor?: string,
    borderColor?: string,
}

export interface getReadyStylesParams {
    snake: SnakeSlice[],
    barriers: BarrierUnit[],
    foodList: FoodOne[]
}