import Image from 'next/image'

const Sponsor = ({ name, path, link}) => {
    return ( 
        <div className='custom-box py-8 custom-background w-[40%] flex justify-center items-center'>
            <a href={link} target="blank" className='w-full flex justify-center' >
                <Image src={path}
                    alt={name}
                    width={130}
                    height={130}
                />
            </a>
        </div>
    )
}

export default Sponsor