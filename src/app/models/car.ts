import { YandexService } from '../yandex.service';

const ACCELERATION = 2;
const BRAKING = 3;

export class Car {
    // ускорение
    acceleration: number = ACCELERATION;

    // торможение
    braking: number = BRAKING;

    // начальная скорость
    v0: number = 0;

    // путь
    s0: number;

    constructor() {
        this.run();
    }

    /**@desc начать движение */
    public run(): void {
        let time = 1;
        let startSpeed = 0;

        let timer = setInterval(() => {
            console.log(this.currentSpeed(startSpeed, time));
            // console.log(this.currentCoordinate(time));
            time = ++time;
        }, 1000)

        setTimeout(() => {
            clearInterval(timer);
            console.log('stopped');
        }, 5000)
    }

    /**@desc текущая скорость */
    private currentSpeed(startSpeed, time): number {
        const speed = startSpeed + ACCELERATION * time;
        return speed;
    }

    /**@desc текущая координата */
    private currentCoordinate(time): number {
        return 10;
    }

    /**@desc можно ускоряться? */
    private needItAccelerate() {}

    /**@desc нужно тормозить? */
    private needItBraking() {}

    /**@desc впереди светофор? */
    private isTraffic() {}
}