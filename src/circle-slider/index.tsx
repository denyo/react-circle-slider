import * as React from "react";
import { CircleSliderHelper } from "./helpers/circle-slider-helper";
import { MouseHelper } from "./helpers/mouse-helper";
import { getPath, polarToCartesian } from "./helpers/path-generator";

interface IProps {
    size?: number;
    circleWidth?: number;
    progressWidth?: number;
    knobRadius?: number;
    value?: number;
    stepSize?: number;
    min?: number;
    max?: number;
    circleColor?: string;
    progressColor?: string;
    gradientColorFrom?: string;
    gradientColorTo?: string;
    knobColor?: string;
    onChange: ((value?: number) => void);
    disabled?: boolean;
    shadow?: boolean;
    showTooltip?: boolean;
    showPercentage?: boolean;
    tooltipSize?: number;
    tooltipColor?: string;
}

interface IPoint {
    x: number;
    y: number;
}

interface IState {
    angle: number;
    currentStepValue: number;
    isMouseMove: boolean;
}

export class CircleSlider extends React.Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
        circleColor: "#e9eaee",
        size: 180,
        value: 0,
        progressColor: "#007aff",
        knobColor: "#fff",
        circleWidth: 5,
        progressWidth: 20,
        knobRadius: 20,
        stepSize: 1,
        min: 0,
        max: 100,
        disabled: false,
        shadow: true,
        showTooltip: false,
        showPercentage: false,
        tooltipSize: 32,
        tooltipColor: "#333",
        onChange: () => ({}),
    };
    private maxLineWidth: number;
    private radius: number;
    private countSteps: number;
    private stepsArray: number[];
    private circleSliderHelper: CircleSliderHelper;
    private mouseHelper!: MouseHelper;
    private svg!: SVGSVGElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            angle: 0,
            currentStepValue: 0,
            isMouseMove: false,
        };

        const {
            min,
            max,
            stepSize,
            value,
            circleWidth,
            progressWidth,
            knobRadius,
        } = this.props;

        this.maxLineWidth = Math.max(circleWidth!, progressWidth!);
        this.radius =
            this.getCenter() - Math.max(this.maxLineWidth, knobRadius! * 2) / 2;
        this.countSteps = 1 + (max! - min!) / stepSize!;
        this.stepsArray = this.getStepsArray(min!, stepSize!);

        this.circleSliderHelper = new CircleSliderHelper(
            this.stepsArray,
            value!,
        );
    }

    public componentDidMount() {
        this.mouseHelper = new MouseHelper(this.svg);
        this.setState({
            angle: Math.floor((this.props.value! / this.props.max!) * 360),
            currentStepValue: this.circleSliderHelper.getCurrentStep(),
        });
    }

    public componentWillReceiveProps(nextProps: any) {
        if (this.props.value !== nextProps.value && !this.state.isMouseMove) {
            this.updateSliderFromProps(nextProps.value);
        }
    }

    public updateAngle = (angle: number): void => {
        this.circleSliderHelper.updateStepIndexFromAngle(angle);
        const currentStep = this.circleSliderHelper.getCurrentStep();
        this.setState({
            angle,
            currentStepValue: currentStep,
        });
        this.props.onChange(currentStep);
    };

    public updateSlider = (): void => {
        const newAngle = this.mouseHelper.getNewSliderAngle();
        // prevent jumping from "< 360 to > 0" and "> 0 to < 360"
        if (Math.abs(newAngle - this.state.angle) < 90) {
            this.updateAngle(newAngle);
        }
    };

    public updateSliderFromProps = (valueFromProps: number): void => {
        const { stepSize } = this.props;
        const newValue = Math.round(valueFromProps / stepSize!) * stepSize!;
        this.circleSliderHelper.updateStepIndexFromValue(newValue);
        this.setState({
            angle: Math.floor((this.props.value! / this.props.max!) * 360),
            currentStepValue: newValue,
        });
    };

    public getCenter = (): number => {
        return this.props.size! / 2;
    };

    public getAngle = (): number => {
        return this.state.angle + Math.PI / 2;
    };

    public getEndAngle = (): number => {
        let angle = Math.floor(
            (this.state.currentStepValue / this.props.max!) * 360,
        );
        // full 360 degree circle can't be drawn
        if (angle === 360) {
            angle -= 0.01;
        }
        return angle;
    };

    public getPointPosition = (): IPoint => {
        const center = this.getCenter();
        return polarToCartesian(
            center,
            center,
            this.radius,
            this.getEndAngle(),
        );
    };

    public getStepsArray = (min: number, stepSize: number): number[] => {
        const stepArray = [];
        for (let i = 0; i < this.countSteps; i++) {
            stepArray.push(min + i * stepSize);
        }
        return stepArray;
    };

    public getPath = (): string => {
        const center = this.getCenter();
        return getPath({
            cx: center,
            cy: center,
            radius: this.radius + this.props.progressWidth! / 2,
            startAngle: 0,
            endAngle: this.getEndAngle(),
            thickness: this.props.progressWidth!,
        });
    };

    public handleMouseMove = (event: MouseEvent): void => {
        event.preventDefault();
        this.setState({
            isMouseMove: true,
        });
        this.mouseHelper.setPosition(event);
        this.updateSlider();
    };

    public handleMouseUp = (event: MouseEvent): void => {
        event.preventDefault();
        this.setState({
            isMouseMove: false,
        });
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    };

    public handleMouseDown = (event: React.MouseEvent<SVGSVGElement>): void => {
        if (!this.props.disabled) {
            event.preventDefault();
            window.addEventListener("mousemove", this.handleMouseMove);
            window.addEventListener("mouseup", this.handleMouseUp);
        }
    };

    public handleTouchMove: any = (
        event: React.TouchEvent<SVGSVGElement>,
    ): void => {
        const targetTouches = event.targetTouches;
        const countTouches = targetTouches.length;
        const currentTouch = targetTouches.item(countTouches - 1)!;
        this.mouseHelper.setPosition(currentTouch);
        this.updateSlider();
    };

    public handleTouchUp = (): void => {
        window.removeEventListener("touchmove", this.handleTouchMove);
        window.removeEventListener("touchend", this.handleTouchUp);
    };

    public handleTouchStart = (): void => {
        if (!this.props.disabled) {
            window.addEventListener("touchmove", this.handleTouchMove);
            window.addEventListener("touchend", this.handleTouchUp);
        }
    };

    public render() {
        const {
            size,
            progressColor,
            gradientColorFrom,
            gradientColorTo,
            knobColor,
            circleColor,
            disabled,
            shadow,
            circleWidth,
            knobRadius,
            showTooltip,
            showPercentage,
            tooltipSize,
            tooltipColor,
        } = this.props;
        const { currentStepValue } = this.state;
        const offset = shadow ? "5px" : "0px";
        const { x, y } = this.getPointPosition();
        const center = this.getCenter();
        const isAllGradientColorsAvailable =
            gradientColorFrom && gradientColorTo;
        return (
            <svg
                ref={svg => (this.svg = svg!)}
                width={`${size}px`}
                height={`${size}px`}
                viewBox={`0 0 ${size} ${size}`}
                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleTouchStart}
                style={{
                    padding: offset,
                    boxSizing: "border-box",
                }}
            >
                <g>
                    <circle
                        style={{
                            strokeWidth: circleWidth!,
                            stroke: circleColor,
                            fill: "none",
                        }}
                        r={this.radius}
                        cx={center}
                        cy={center}
                    />
                    {isAllGradientColorsAvailable && (
                        <defs>
                            <linearGradient
                                id="gradient"
                                x1="0"
                                x2="0"
                                y1="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={gradientColorFrom}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={gradientColorTo}
                                />
                            </linearGradient>
                        </defs>
                    )}
                    <path
                        style={{
                            stroke: "none",
                            fill: isAllGradientColorsAvailable
                                ? "url(#gradient)"
                                : progressColor,
                            fillRule: "evenodd",
                        }}
                        d={this.getPath()}
                    />
                    {shadow && (
                        <filter id="dropShadow" filterUnits="userSpaceOnUse">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="2" dy="2" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    )}
                    <circle
                        style={{
                            fill: knobColor,
                            cursor: disabled ? "not-allowed" : "pointer",
                        }}
                        filter={shadow ? "url(#dropShadow)" : "none"}
                        r={knobRadius!}
                        cx={x}
                        cy={y}
                    />
                    {showTooltip && (
                        <text
                            x={size! / 2}
                            y={size! / 2 + tooltipSize! / 3}
                            textAnchor={"middle"}
                            fontSize={tooltipSize!}
                            fontFamily="Arial"
                            fill={tooltipColor}
                        >
                            {showPercentage
                                ? `${currentStepValue}%`
                                : currentStepValue}
                        </text>
                    )}
                </g>
            </svg>
        );
    }
}
