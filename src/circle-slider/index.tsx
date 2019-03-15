import React, { useEffect, useRef, useState } from "react";
import { CircleSliderHelper } from "./helpers/circle-slider-helper";
import { buildPath, polarToCartesian } from "./helpers/path-generator";

type Props = {
    value?: number;
    size?: number;
    stepSize?: number;
    min?: number;
    max?: number;
    circleWidth?: number;
    circleColor?: string;
    progressWidth?: number;
    progressColor?: string;
    gradientColorFrom?: string;
    gradientColorTo?: string;
    knobColor?: string;
    knobRadius?: number;
    disabled?: boolean;
    shadow?: boolean;
    showTooltip?: boolean;
    showPercentage?: boolean;
    tooltipSize?: number;
    tooltipColor?: string;
    onChange: (value?: number) => void;
};

export const CircleSlider: React.FC<Props> = ({
    value = 0,
    size = 180,
    stepSize = 1,
    min = 0,
    max = 100,
    circleWidth = 5,
    circleColor = "#e9eaee",
    progressWidth = 20,
    progressColor = "#007aff",
    gradientColorFrom,
    gradientColorTo,
    knobColor = "#fff",
    knobRadius = 20,
    disabled = false,
    shadow = true,
    showTooltip = false,
    showPercentage = false,
    tooltipSize = 32,
    tooltipColor = "#333",
    onChange,
}) => {
    const center = size / 2;
    const getStepsArray = () => {
        const stepArray = [];
        for (let i = 0; i < countSteps; i++) {
            stepArray.push(min + i * stepSize);
        }
        return stepArray;
    };

    const maxLineWidth = Math.max(circleWidth, progressWidth);
    const radius = center - Math.max(maxLineWidth, knobRadius * 2) / 2;
    const countSteps = 1 + (max - min) / stepSize;
    const stepsArray = getStepsArray();
    const circleSliderHelper = new CircleSliderHelper(stepsArray, value);

    const svgRef = useRef<SVGSVGElement>();
    const [angle, setAngle] = useState(Math.floor((value / max) * 360));
    const [step, setStep] = useState(circleSliderHelper.getCurrentStep());
    const [isMouseMove, setIsMouseMove] = useState(false);

    useEffect(
        () => {
            if (!isMouseMove) {
                updateSliderFromProps(value);
            }
        },
        [value, isMouseMove],
    );

    const updateAngle = (newAngle: number) => {
        circleSliderHelper.updateStepIndexFromAngle(newAngle);
        const newStep = circleSliderHelper.getCurrentStep();
        setAngle(newAngle);
        setStep(newStep);

        if (onChange) {
            onChange(newStep);
        }
    };

    let prevNewAngle = angle; // necessary since functional component
    const updateSliderFromEvent = (event: MouseEvent | React.Touch) => {
        const rectSize = svgRef.current.getBoundingClientRect();
        const rectCenter = rectSize.width / 2;
        const relativeX = event.clientX - rectSize.left;
        const relativeY = event.clientY - rectSize.top;

        const x = relativeX - rectCenter;
        const y = relativeY - rectCenter;
        const angleBetweenTwoVectors = Math.atan2(y, x);

        let newAngle = (angleBetweenTwoVectors * 180) / Math.PI + 90;
        if (x < 0 && y < 0) {
            newAngle += 360;
        }

        // prevent jumping from "< 360 to > 0" and "> 0 to < 360"
        if (Math.abs(newAngle - prevNewAngle) < 90) {
            updateAngle(newAngle);
            prevNewAngle = newAngle;
        }
    };

    const updateSliderFromProps = (valueFromProps: number) => {
        const newValue = Math.round(valueFromProps / stepSize!) * stepSize!;
        circleSliderHelper.updateStepIndexFromValue(newValue);

        setAngle(Math.floor((value / max) * 360));
        setStep(newValue);
    };

    const getPath = () =>
        buildPath({
            cx: center,
            cy: center,
            radius: radius + progressWidth / 2,
            startAngle: 0,
            endAngle: angle,
            thickness: progressWidth,
        });

    // mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        setIsMouseMove(true);
        updateSliderFromEvent(event);
    };

    const handleMouseUp = (event: MouseEvent) => {
        event.preventDefault();
        setIsMouseMove(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
        if (!disabled) {
            event.preventDefault();
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
    };

    // touch event handlers
    const handleTouchMove: any = (event: React.TouchEvent<SVGSVGElement>) => {
        const targetTouches = event.targetTouches;
        const countTouches = targetTouches.length;
        const currentTouch = targetTouches.item(countTouches - 1);
        updateSliderFromEvent(currentTouch);
    };

    const handleTouchUp = () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchUp);
    };

    const handleTouchStart = () => {
        if (!disabled) {
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleTouchUp);
        }
    };

    const offset = shadow ? "5px" : "0px";
    const progressPath = buildPath({
        cx: center,
        cy: center,
        radius: radius + progressWidth / 2,
        startAngle: 0,
        endAngle: angle,
        thickness: progressWidth,
    });
    const knobCenter = polarToCartesian(center, center, radius, angle);
    const isAllGradientColorsAvailable = gradientColorFrom && gradientColorTo;

    return (
        <svg
            ref={svgRef}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
                padding: offset,
                boxSizing: "border-box",
            }}
        >
            <g>
                <circle
                    style={{
                        strokeWidth: circleWidth,
                        stroke: circleColor,
                        fill: "none",
                    }}
                    r={radius}
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
                            <stop offset="0%" stopColor={gradientColorFrom} />
                            <stop offset="100%" stopColor={gradientColorTo} />
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
                    d={progressPath}
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
                    r={knobRadius}
                    cx={knobCenter.x}
                    cy={knobCenter.y}
                />
                {showTooltip && (
                    <text
                        x={size / 2}
                        y={size / 2 + tooltipSize / 3}
                        textAnchor="middle"
                        fontSize={tooltipSize}
                        fontFamily="Arial"
                        fill={tooltipColor}
                    >
                        {showPercentage ? `${step}%` : step}
                    </text>
                )}
            </g>
        </svg>
    );
};
