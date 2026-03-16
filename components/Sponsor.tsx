import Image from 'next/image'

const Sponsor = (data: {
    link: string,
    path: string,
    name: string,
    size: number
}) => {
    return (
        <div className='py-8 w-[40%] flex justify-start items-center' >
            <a href={data.link} target="blank" className="hover:opacity-80 transition-opacity lg:ml-[40px]">
                <span className="text-2xl font-bold text-white">{data.name}</span>
            </a>
        </div>
    )
}
export default Sponsor
