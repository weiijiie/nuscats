import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  IonRouterLink,
  IonToolbar,
  useIonAlert,
} from '@ionic/react';
import {
  FORGET_PASSWORD_ROUTE,
  MAP_ROUTE,
  RESEND_EMAIL_ROUTE,
  SETUP_PROFILE_ROUTE,
} from 'app/routes';
import TextInput from 'components/form/TextInput';
import useAuth from 'hooks/useAuth';
import { login } from 'lib/auth';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';

type SigninInputs = {
  email: string;
  password: string;
};

const Signin: React.FC = () => {
  const [showErrorAlert] = useIonAlert();
  const { setLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninInputs>();

  const history = useHistory();

  const onSubmit: SubmitHandler<SigninInputs> = async (data) => {
    setLoading(true);
    const { user, err, unauthorized } = await login(data.email, data.password);
    setLoading(false);
    if (err || unauthorized) {
      console.log({ err, unauthorized });
      showErrorAlert(`${err}`);
      return;
    }

    if (user) {
      setLogin(user.uuid);
      if (!user.profile?.is_profile_setup) {
        history.push(SETUP_PROFILE_ROUTE);
      } else {
        history.push(MAP_ROUTE);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="flex flex-col items-center">
          <div className="mx-5 mt-5 mb-5 text-center">
            <p className="mb-1 text-2xl font-semibold text-transparent bg-clip-text sm:text-3xl md:text-4xl bg-gradient-to-br from-primary-600 to-secondary-600">
              Welcome back!
            </p>
            <p className="my-2 text-lg font-bold tracking-wide text-gray-800 sm:text-xl md:text-2xl">
              NUS cats are waiting for you
            </p>
          </div>
          <div className="w-full max-w-md">
            <IonLoading isOpen={loading} message={'Please wait...'} />
            <form
              className="flex flex-col mt-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                id="email"
                type="email"
                label="Email"
                register={register('email', { required: true })}
                errors={[{ isError: !!errors.email, msg: 'Email is required' }]}
              />
              <TextInput
                id="password"
                type="password"
                label="Password"
                register={register('password', { required: true })}
                errors={[
                  { isError: !!errors.password, msg: 'Password is required' },
                ]}
              />
              <input
                id="submit"
                className="mx-5 mt-1 text-lg font-medium text-white h-14 rounded-xl bg-primary-400"
                type="submit"
                value="Sign in"
              />
            </form>
          </div>
          <div className="w-full mt-5 text-center">
            <IonRouterLink routerLink={FORGET_PASSWORD_ROUTE}>
              Forgot your password?
            </IonRouterLink>
          </div>
          <div className="w-full mt-2 text-center">
            <IonRouterLink className="text-gray-600" routerLink={RESEND_EMAIL_ROUTE}>
              Resend email confirmation?
            </IonRouterLink>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signin;
