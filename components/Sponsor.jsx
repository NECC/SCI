import Image from 'next/image'

const Sponsor = (data) => {
    return (
        <div className='py-8 w-[40%] flex justify-start items-center' >
            <a href={data.link} target="blank">
                <Image
                    src={data.path}
                    alt={data.name}
                    width={150}
                    height={150}
                    className='hover:scale-105'
                />  
            </a>
        </div>
    )
}
export default Sponsor
