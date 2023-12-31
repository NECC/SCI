import Nav from "@components/Nav";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
} from "@nextui-org/react";

export default function Schedule() {
  return (
    <div className="bg-black h-screen bg-[url('/rectangle.png')] bg-no-repeat bg-top bg-cover">
      <Nav />
      <div className="gap-2 px-8 pt-20">
        <Card isBlurred className="w-full h-[700px]">
          <CardHeader className="bg-black/40 border-b-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center p-2">
              <div className="flex flex-col text-white/90 ">
                <h2 className="uppercase font-black text-2xl">Schedule</h2>
                <p className="text-sm">Forest Day</p>
              </div>
            </div>
            <Button radius="full" size="sm">
              Get App
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col md:flex-row gap-3">
            <div className="flex flex-col md:flex-row">
              <Chip className="mb-3 bg-[#B8E2FF] text-black md:mb-0 md:mr-3 z-10">
                9:00
              </Chip>
              <div className="flex flex-row md:flex-col">
                <div className="bg-white w-[1px] mx-3 md:h-[1px] md:my-3 md:mx-0 md:w-auto"></div>
                <Card className="w-[300px] -translate-y-5 md:translate-y-0 md:-translate-x-10 md:-mr-5">
                  <CardBody className="gap-2 p-5 rounded-2xl">
                    <h4 className="text-white/90 font-bold text-xl">
                      🏁 Sessao de abertura
                    </h4>
                    <p className="text-tiny text-white/60 font-medium">
                      Edificio 1 - 0.23
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <Chip className="mb-3 bg-[#0583D1] text-white md:mb-0 md:mr-3 z-10">
                9:30
              </Chip>
              <div className="flex flex-row md:flex-col">
                <div className="bg-white w-[1px] mx-3 md:h-[1px] md:my-3 md:mx-0 md:w-auto"></div>
                <Card className="w-[300px] -translate-y-5 md:translate-y-0 md:-translate-x-10 md:-mr-5">
                  <CardBody className="gap-2 p-5 rounded-2xl">
                    <p className="text-tiny text-white/60 uppercase font-bold">
                      BIOQUIMICA
                    </p>
                    <h4 className="text-white/90 font-bold text-xl">
                      Stream the Apple 🍎
                    </h4>
                    <p className="text-tiny text-white/60 font-medium">
                      Room-filling sound, Intelligent assistant. Smart home
                      control. Works seamlessly with iPhone. Check it out
                    </p>
                  </CardBody>
                  <CardFooter className="flex flex-row gap-2 p-5 bg-gray-700/50">
                    <Image
                      src="/sci-logo.png"
                      alt="logo"
                      width={30}
                      height={30}
                    />
                    <p className="text-tiny text-white/60 font-medium">
                      Pedro Augennes
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <Chip className="mb-3 md:mb-0 md:mr-3 z-10">11:00</Chip>
              <div className="flex flex-row md:flex-col">
                <div className="bg-white w-[1px] mx-3 md:h-[1px] md:my-3 md:mx-0 md:w-auto"></div>
                <Card className="w-[300px] -translate-y-5 md:translate-y-0 md:-translate-x-10 md:-mr-5">
                  <CardBody className="gap-2 p-5 rounded-2xl">
                    <h4 className="text-white/90 font-bold text-xl">
                      ☕ Coffee Break
                    </h4>
                  </CardBody>
                </Card>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
