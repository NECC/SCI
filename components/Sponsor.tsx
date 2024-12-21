import Image from 'next/image'

const Sponsor = (data: {
    link: string,
    path: string,
    name: string,
    size: number
}) => {
    return (
        <div className='py-8 w-[40%] flex justify-start items-center' >
            <a href={data.link} target="blank">
                <Image
                    src={data.path}
                    alt={data.name}
                    width={data.size}
                    height={150}
                    className={`hover:scale-105 lg:ml-[40px]`}
                />  
            </a>
        </div>
    )
}
export default Sponsor
