import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Card, CardContent, CardActions, CircularProgress, Grid } from '@material-ui/core';
import { Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Postagem } from '../../models/Postagem';
import { getAll, getId } from '../../service/Service';
import { Tema } from '../../models/Tema';
import { useSelector } from 'react-redux';
import { TokenState } from '../../store/tokenReducer';
import { toast } from 'react-toastify';
import { Usuario } from '../../models/Usuario';

function ListaPostagens() {

    const [postagens, setPostagens] = useState<Postagem[]>([])
    const token = useSelector<TokenState, TokenState['token']>(
        (state) => state.token
    )
    const navigate = useNavigate()
    const [temas, setTemas] = useState<Tema[]>([])


    async function getAllTemas() {
        await getAll('/temas', setTemas, {
            headers: {
                Authorization: token
            }
        })
    }

    async function ListaPostagem() {
        await getAll('/postagens', setPostagens, {
            headers: {
                Authorization: token
            }
        })
    }

    useEffect(() => {
        ListaPostagem()
    }, [])

    useEffect(() => {
        getAllTemas()
    }, [])

    useEffect(() => {
        if (token === '') {
            toast.error('Não autorizado!', {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            navigate('/login')
        }
    }, [])

    return (
        <>
            {postagens.length === 0 && (
                <Grid container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '60vh' }}>
                    <Box sx={{ display: 'flex' }} >
                        <CircularProgress />
                    </Box>
                </Grid>
            )}
            {postagens.map((postagem) => (
                <Box m={2}>
                    <Card variant='outlined'>
                        <CardContent>
                            <Typography variant='h5' component='h2' >
                                <strong>{postagem.titulo}</strong>
                            </Typography>
                            <Typography variant='h5' component='p'>
                                {postagem.tema?.descricao}
                            </Typography>
                            <Typography variant='body1' component='p'>
                                {postagem.texto}
                            </Typography>
                            <Typography variant='body1' component='p'>
                                <a href={postagem.link} target='_blank'>Set SoundCloud</a>
                            </Typography>
                            <Typography variant="body2" component="p">
                                Postado por: {postagem.usuario?.nome}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Data: {Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(postagem.data))}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            ))}
        </>
    );
}
export default ListaPostagens;
