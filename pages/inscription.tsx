import { FormEvent, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { fetchApi } from '@lib/api';
import { getFormData } from '@contexts/Utils';
import { Button, Input } from '@components/StyledComponents';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();

    // redirect to home if already logged in
    useEffect(() => {
        const access_token = window.localStorage.getItem('access_token');
        if (access_token) router.push('/');
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = getFormData('#form');

        if (data.password != data.password_repeat) {
            return toast('Les mots de passe ne correspondent pas', { type: 'error' });
        }
        delete data.password_repeat;

        const query = await fetchApi('register', { method: 'POST', body: JSON.stringify(data) });

        if (query.success && query.access_token) {
            window.localStorage.setItem('access_token', query.access_token);
            window.localStorage.setItem('user', JSON.stringify(query.data));
            window.location.pathname = '/';
        } else toast(query.message, { type: 'error' });
    };

    return (
        <S.Container>
            <Head>
                <title>Inscription</title>
            </Head>
            <S.Form id="form" onSubmit={handleSubmit}>
                <h1>Inscription</h1>
                <Input defaultValue="a@a.a" type="email" placeholder="Email" name="email" required={true} autoComplete="off" />
                <Input type="password" placeholder="Mot de passe" name="password" required={true} autoComplete="off" />
                <Input type="password" placeholder="Répéter le mot de passe" name="password_repeat" required={true} autoComplete="off" />
                <Input $width="calc(50% - 5px)" placeholder="Prénom" name="firstname" required={true} autoComplete="off" />
                <Input $width="calc(50% - 5px)" placeholder="Nom" name="name" required={true} autoComplete="off" />
                <Input placeholder="Adresse" name="address" required={true} autoComplete="off" />
                <Input $width="calc(50% - 5px)" placeholder="Code postal" name="postal_code" required={true} autoComplete="off" />
                <Input $width="calc(50% - 5px)" placeholder="Ville" name="city" required={true} autoComplete="off" />
                <div>
                    <Link href="/connexion">Connexion</Link>
                    <Button>S'inscrire</Button>
                </div>
            </S.Form>
        </S.Container>
    );
}

const S: any = {};
S.Container = styled.div`
    height: 100vh;
    padding: 0 20px;
    display: flex;

    h1 {
        margin-bottom: 10px;
    }
`;

S.Form = styled.form`
    margin: auto;
    width: 400px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    background: black;
    border-radius: 5px;
    padding: 30px;

    > div {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 20px;
        width: 100%;

        button {
            width: 150px;
        }
    }
`;
