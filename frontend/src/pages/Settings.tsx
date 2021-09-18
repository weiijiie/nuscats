import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { Camera, CameraResultType } from "@capacitor/camera";
import { CHANGE_PASSWORD_ROUTE, CHANGE_USERNAME_ROUTE } from "app/routes";

const Settings: React.FC = () => {

	// Upload/take profile picture
	const handleChangeProfilePic = async () => {
		try {
			const image  = await Camera.getPhoto({
				quality: 90,
				allowEditing: true,
				resultType: CameraResultType.Uri,
			});
			console.log(image);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton />
					</IonButtons>
					<IonTitle>
						Settings
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList>
					<IonItem button routerLink={CHANGE_USERNAME_ROUTE}>
						<IonLabel>Change username</IonLabel>
					</IonItem>
					<IonItem button routerLink={CHANGE_PASSWORD_ROUTE}>
						<IonLabel>Change password</IonLabel>
					</IonItem>
					<IonItem button onClick={handleChangeProfilePic}>
						<IonLabel>Change profile picture</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default Settings;