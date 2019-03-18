import React, { useRef } from "react";
import { buildPath, polarToCartesian } from "./helpers";

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

const THRESHOLD = 0.01;

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
    showTooltip = true,
    showPercentage = false,
    tooltipSize = 32,
    tooltipColor = "#333",
    onChange,
}) => {
    const center = size / 2;
    const radius = center - Math.max(circleWidth, progressWidth, knobRadius * 2) / 2;

    // takes care of min, max and stepSize
    const formatValue = (input?: number) => Math.round((input || (value < min ? min : value > max ? max : value)) / stepSize) * stepSize;

    const valueToAngle = () => {
        const newAngle = Math.round(((formatValue() - min) / (max - min)) * 360);
        return newAngle === 360 ? newAngle - THRESHOLD : newAngle % 360;
    };

    const angleToValue = (newAngle: number) => formatValue(newAngle / (360 / (max - min))) + min;

    const svgRef = useRef<SVGSVGElement>();
    const prevX = useRef<number>(); // necessary since functional component

    const updateSliderFromEvent = (event: MouseEvent | React.Touch) => {
        const rectSize = svgRef.current.getBoundingClientRect();
        const rectCenter = rectSize.width / 2;

        const x = event.clientX - rectSize.left - rectCenter;
        const y = event.clientY - rectSize.top - rectCenter;
        const angleBetweenTwoVectors = Math.atan2(y, x);

        let newAngle = Math.round((angleBetweenTwoVectors * 180) / Math.PI) + 90;

        if (x < 0 && y < 0) {
            newAngle += 360;
        }

        // prevent jumping from "< 360 to > 0" and "> 0 to < 360"
        if (y < 0) {
            if (prevX.current < 0 && x > 0) {
                newAngle = 360 - THRESHOLD; // can't go over 360
            } else if (prevX.current > 0 && x < 0) {
                newAngle = THRESHOLD; // can't go lower than 0
            } else {
                prevX.current = x;
            }
        } else {
            prevX.current = x;
        }

        onChange(angleToValue(newAngle));
    };

    // mouse event handlers
    const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        updateSliderFromEvent(event);
    };

    const handleMouseUp = (event: MouseEvent) => {
        event.preventDefault();
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
        endAngle: valueToAngle(),
        thickness: progressWidth,
    });
    const knobCenter = polarToCartesian(center, center, radius, valueToAngle());
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
                touchAction: "none",
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
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={gradientColorFrom} />
                            <stop offset="100%" stopColor={gradientColorTo} />
                        </linearGradient>
                    </defs>
                )}
                <path
                    style={{
                        stroke: "none",
                        fill: isAllGradientColorsAvailable ? "url(#gradient)" : progressColor,
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
                        {formatValue()}
                        {showPercentage && "%"}
                    </text>
                )}
            </g>
        </svg>
    );
};
