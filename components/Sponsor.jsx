import Image from 'next/image'

const Sponsor = ({ name, path, link }) => {
    return (
        <div className='py-8 w-[40%] flex justify-start items-center' >
            <a href={link} target="blank">
                <Image
                    src={path}
                    alt={name}
                    width={150}
                    height={150}
                />
            </a>
        </div>
    )
}
export default Sponsor
