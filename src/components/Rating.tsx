interface CircularProgressBarProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    }

    const CircularProgressBar: React.FC = ({
    percentage,
    size = 120,
    strokeWidth = 10,
    }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
    <svg
    width={size}
    height={size}
    viewBox={0 0 ${size} ${size}}
    className="circular-progress-bar"
    >
    <circle
    className="circle-bg"
    stroke="#e6e6e6"
    strokeWidth={strokeWidth}
    fill="none"
    cx={size / 2}
    cy={size / 2}
    r={radius}
    />
    <circle
    className="circle-progress"
    stroke="#3b82f6"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    fill="none"
    cx={size / 2}
    cy={size / 2}
    r={radius}
    strokeDasharray={circumference}
    strokeDashoffset={offset}
    transform={rotate(-90 ${size / 2} ${size / 2})} // Rotate the circle to start at the top
    />

    {${percentage}%}


    );
    };

    export default CircularProgressBar;