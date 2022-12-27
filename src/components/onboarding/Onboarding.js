import React from 'react';
import {inject, observer} from "mobx-react";
import {Box, Button, Grid, TextField, useTheme} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import {LoadingButton} from "@mui/lab";
import axios from "axios";
import {router} from "../../router";

function Onboarding(props) {
    const theme = useTheme()

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    const {authStore} = props

    async function updateUser() {
        setLoading(true)
        try {
            await axios.patch(`/api/user/v1/users/${authStore.userId}`, {firstName, lastName})
            setIndex(2)
        } finally {
            setLoading(false)
        }
    }

    async function completeOnboarding() {
        setLoading(true)
        try {
            await axios.patch(`/api/user/v1/users/${authStore.userId}`, {onboardingCompleted: true})
            setLoading(false)
            router.push("/")
        } catch {
            setLoading(false)
        }
    }

    return (
        <Grid container justifyContent={"center"}>
            <Grid container item xs={12} md={6}>
                <Carousel
                    autoPlay={false}
                    animation={"slide"}
                    sx={{width: "100%"}}
                    height={"30rem"}
                    duration={500}
                    index={index}
                    navButtonsAlwaysInvisible={true}
                    indicatorIconButtonProps={{
                        style: {
                            margin: "0.3rem",
                            backgroundColor: theme.palette.primary.light,
                            color: theme.palette.primary.light,
                        }
                    }}
                    activeIndicatorIconButtonProps={{
                        style: {
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.dark,
                        }
                    }}
                    indicatorContainerProps={{
                        style: {
                            marginTop: theme.spacing(6),
                            textAlign: "center"
                        }
                    }}
                >
                    <div>
                        <h2 style={{marginBottom: theme.spacing(2)}}>Welcome to Nevvi!</h2>
                        <p>
                            Our goal is to keep those in your life updated when those inevitable life changes happen.
                        </p>
                        <p>
                            How many times have you moved and had to let everyone in your life know your latest address
                            to receive mail at? Have you ever gotten a new phone number and had to find a way to tell
                            everyone what that new number is?
                        </p>
                        <p>
                            With Nevvi, instead of you having to update everyone with your latest information... we do
                            it
                            for you. Of course, you are still in control of your information and what you choose to
                            share
                            with each person specifically. What we want to solve is making sure you stay connected with
                            those in your life even when stuff changes like an address or a phone number.
                        </p>

                        <Grid container justifyContent={"center"}>
                            <Button variant={"contained"} onClick={() => setIndex(1)}>Next</Button>
                        </Grid>
                    </div>
                    <Grid container>
                        <h2 style={{marginBottom: theme.spacing(2)}}>Getting Started</h2>
                        <p style={{marginBottom: theme.spacing(2)}}>
                            First things first let's get some more information about you so that others know who you
                            are.
                        </p>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="standard"
                                id="first-name-input"
                                label="First Name"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{mt: theme.spacing(1), mb: theme.spacing(2)}}>
                            <TextField
                                fullWidth
                                variant="standard"
                                id="last-name-input"
                                label="Last Name"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>

                        <Box>
                            <LoadingButton
                                size={"small"}
                                variant="contained"
                                color="primary"
                                loading={loading}
                                disabled={firstName === "" || lastName === ""}
                                onClick={() => updateUser()}>
                                Update
                            </LoadingButton>
                        </Box>
                    </Grid>

                    <div>
                        <h2 style={{marginBottom: theme.spacing(2)}}>Making Connections</h2>
                        <p>
                            The heart and soul of this application is the connections you make with others.
                        </p>
                        <p>
                            Creating a connection creates a bi-directional link between 2 people where each person
                            defines what they want the other person to have access to. Maybe they let you see everything,
                            while you only want them to see your contact information and nothing else.
                        </p>
                        <p>
                            To specify only a subset of information to expose you'll need to create a custom permission
                            group and select only the fields you want people in that group to see. Once you do that,
                            when you request a connection or accept a connection you can select what group you want that
                            user to be in.
                        </p>
                        <Grid container justifyContent={"center"}>
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                loading={loading}
                                onClick={() => completeOnboarding()}>
                                Finish Onboarding
                            </LoadingButton>
                        </Grid>
                    </div>
                </Carousel>
            </Grid>
        </Grid>
    );
}

export default inject("authStore")(observer(Onboarding));
