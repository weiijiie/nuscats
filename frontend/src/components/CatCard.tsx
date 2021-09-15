import { IonIcon, IonRouterLink } from '@ionic/react'
import { locationOutline } from 'ionicons/icons'
import { Cat } from '@api/cats'

interface CatCardProps {
    cat: Cat
}

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
    const placerHolderCatImgUrl = "https://images.unsplash.com/photo-1586042091284-bd35c8c1d917?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"

    return (
        <IonRouterLink routerLink={`/cats/${cat.id}`}>
            <div className="flex justify-between px-4 mx-5 mt-5 shadow-xl bg-secondary-100 rounded-2xl bg-opacity-90">
                <div className="flex-shrink-0 mb-4 mt-7">
                    <img className="object-cover w-24 h-24 rounded-full" src={placerHolderCatImgUrl} alt="very cute cat"></img>
                </div>
                <div className="flex flex-col justify-start flex-auto mt-5 mb-4 ml-4">
                    <p className="text-xl font-semibold text-gray-700">{cat.name}</p>
                    <div className="flex items-center mt-1">
                        <IonIcon color="secondary" icon={locationOutline}></IonIcon>
                        <p className="ml-1 text-sm font-semibold text-secondary-500">Tembusu</p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-600 line-clamp-2">{cat.description}</p>
                </div>
            </div>
        </IonRouterLink>
    )
}

export default CatCard