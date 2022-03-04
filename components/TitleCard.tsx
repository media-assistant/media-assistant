import Image from "next/image";
import Link from "next/link";

interface TitleCardProps {
  id: number;
  summary?: string;
  year?: string | number;
  title: string;
  // mediaType: MediaType;
  // status?: MediaStatus;
  canExpand?: boolean;
  inProgress?: boolean;
  href: string;
  poster: string;
}

const TitleCard: React.FC<TitleCardProps> = ({
  href,
  summary,
  year,
  title,
  // status,
  // mediaType,
  // inProgress = false,
  poster,
  canExpand = false,
}) => {
  return (
    <div className={canExpand ? "w-full" : "w-36 sm:w-36 md:w-44"}>
      <div
        className="relative scale-100 transform-gpu cursor-default overflow-hidden rounded-xl bg-gray-800 bg-cover pb-[150%] shadow outline-none ring-1 ring-gray-700 transition duration-300"
        role="link"
        tabIndex={0}
      >
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Image
            alt=""
            className="absolute inset-0 h-full w-full"
            layout="fill"
            objectFit="cover"
            src={poster}
          />
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <Link href={href}>
              <a
                className="absolute inset-0 h-full w-full cursor-pointer overflow-hidden text-left"
                // style={{
                //   background:
                //     "linear-gradient(180deg, rgba(45, 55, 72, 0.4) 0%, rgba(45, 55, 72, 0.9) 100%)",
                // }}
              >
                {/* <div className="flex h-full w-full items-end">
                  <div className="px-2 pb-2 text-white">
                    {year && <div className="text-sm font-medium">{year}</div>}

                    <h1
                      className="whitespace-normal text-xl font-bold leading-tight"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        display: "-webkit-box",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {title}
                    </h1>
                    <div
                      className="whitespace-normal text-xs"
                      style={{
                        WebkitBoxOrient: "vertical",
                        display: "-webkit-box",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {summary}
                    </div>
                  </div>
                </div> */}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
