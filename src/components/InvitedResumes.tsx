import { Separator } from "./ui/separator";

const InvitedResumes = () => {
  return (
    <div className="my-2">
      {/* <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <p>{resume.fullName}</p>
          <p className="font-semibold">{resume.setMark}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              hireResume(resume.id).then(() =>
                setReloadResumes((prev) => !prev)
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={
                resume.accepted === "hire"
                  ? "text-green-500 size-6"
                  : "text-black size-6 hover:text-gray-600"
              }
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <div className="relative w-10 h-10 ">
            <svg className="w-full h-full " viewBox="0 0 100 100">
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>{" "}
              <circle
                className={`${getRatingColor(
                  resume.rating
                )} progress-ring__circle stroke-current`}
                strokeWidth="10"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke-dasharray={getDashArray(resume.rating)}
                stroke-dashoffset="calc(251.2px - (251.2px * 70) / 100)"
              ></circle>
              <text
                x="50"
                y="50"
                font-size="32"
                text-anchor="middle"
                alignment-baseline="middle"
                className="flex font-semibold items-center justify-center"
              >
                {resume.rating}
              </text>
            </svg>
          </div>
        </div>
      </div>
      <Separator /> */}
    </div>
  );
};

export default InvitedResumes;
