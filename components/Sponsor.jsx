import Image from 'next/image'

const Sponsor = ({ name, path, link, description }) => {
    return (

        <>
            <div className='flex flex-col gap-4 justify-center items-center'>
                <Image src={path}
                    alt={name}
                    width={400}
                    height={400}
                    className="lg:w-[32%]"
                />
                <p className='text-white'>{name}</p>
                <p className='text-white'>{link}</p>
                <p className='text-white'>{description}</p>
            </div>
        </>
    )
}

export default Sponsor