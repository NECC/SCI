import Image from 'next/image'

const Sponsor = (data: {
    link: string,
    path: string,
    name: string,
    size: number
}) => {
    return (
        <div className='w-[22%] flex justify-start items-center bg-transparent block mt-auto mb-auto'>
        <a 
            href={data.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-30 "
        >
            <Image
            src={data.path}
            alt='sponsor'
            width={250}
            height={250}
            className='hover:opacity-80 mix-blend-multiply'
            />
        </a>
        </div>
    )
}
export default Sponsor