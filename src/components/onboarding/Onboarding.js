import React from 'react';
import {inject, observer} from "mobx-react";
import {
    Alert,
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {router} from '../../router';
import Logo from "../utils/Logo";
import {CheckCircle, ConnectWithoutContact, PersonAdd, Security,} from "@mui/icons-material";

function Onboarding(props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [address, setAddress] = React.useState({
        street: "",
        unit: "",
        city: "",
        state: "",
        zipCode: ""
    });
    const [loading, setLoading] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(0);

    // Refs to maintain focus
    const firstNameRef = React.useRef(null);
    const lastNameRef = React.useRef(null);
    const addressRef = React.useRef(null);

    const { accountStore } = props;

    // Redirect if onboarding already completed
    React.useEffect(() => {
        try {
            if (accountStore.user && accountStore.user.onboardingCompleted) {
                router.push("/");
            }
        } catch (error) {
            console.error("Error checking onboarding status:", error);
        }
    }, [accountStore.user]);

    const steps = [
        { label: 'Welcome', icon: <CheckCircle /> },
        { label: 'Your Info', icon: <PersonAdd /> },
        { label: 'Get Started', icon: <ConnectWithoutContact /> }
    ];

    const updateUser = React.useCallback(async () => {
        setLoading(true);
        try {
            accountStore.updateUser("firstName", firstName);
            accountStore.updateUser("lastName", lastName);
            
            // Check if any address fields have values
            const hasAddressData = Object.values(address).some(field => field.trim() !== "");
            if (hasAddressData) {
                accountStore.updateUser("address", address);
            }
            
            await accountStore.saveUser();
            setCurrentStep(2);
        } finally {
            setLoading(false);
        }
    }, [firstName, lastName, address, accountStore]);

    async function completeOnboarding() {
        setLoading(true);
        try {
            accountStore.updateUser("onboardingCompleted", true);
            await accountStore.saveUser();
            router.push("/");
        } catch {
            setLoading(false);
        }
    }

    // Memoized handlers to prevent re-renders
    const handleFirstNameChange = React.useCallback((e) => {
        setFirstName(e.target.value);
    }, []);

    const handleLastNameChange = React.useCallback((e) => {
        setLastName(e.target.value);
    }, []);

    const handleAddressChange = React.useCallback((field, value) => {
        setAddress(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const WelcomeStep = () => (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
                Welcome to Nevvi!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                Keep your connections updated automatically when life changes happen
            </Typography>

            <Stack spacing={3} sx={{ mt: 4, maxWidth: '500px', mx: 'auto' }}>
                <Card elevation={2}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonAdd color="primary" sx={{ fontSize: 40 }} />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h6" gutterBottom>
                                Stay Connected
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                No more hunting down everyone's contact info when you move or change numbers
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card elevation={2}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Security color="primary" sx={{ fontSize: 40 }} />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h6" gutterBottom>
                                You're In Control
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create permission groups to decide what each person can see
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card elevation={2}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ConnectWithoutContact color="primary" sx={{ fontSize: 40 }} />
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography variant="h6" gutterBottom>
                                Automatic Updates
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                When you update your info, your connections see the changes instantly
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>

            <LoadingButton
                variant="contained"
                size="large"
                onClick={() => setCurrentStep(1)}
                sx={{ mt: 4, px: 4, py: 1.5 }}
            >
                Get Started
            </LoadingButton>
        </Box>
    );

    const PersonalInfoStep = React.useMemo(() => (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Tell Us About Yourself
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                This helps your connections identify you when they search
            </Typography>

            <Box sx={{ maxWidth: '500px', mx: 'auto' }}>
                <Stack spacing={3}>
                    <TextField
                        ref={firstNameRef}
                        required
                        fullWidth
                        id="first-name-input"
                        label="First Name"
                        type="text"
                        autoFocus
                        value={firstName}
                        onChange={handleFirstNameChange}
                        autoComplete="given-name"
                    />

                    <TextField
                        ref={lastNameRef}
                        required
                        fullWidth
                        id="last-name-input"
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={handleLastNameChange}
                        autoComplete="family-name"
                    />

                    <Typography variant="h6" sx={{ mt: 3, mb: 1, textAlign: 'left' }}>
                        Address (Optional)
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ ml: 0, width: '100%', '& > .MuiGrid-item': { pl: 0 } }}>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                id="street-address-input"
                                label="Street Address"
                                type="text"
                                value={address.street}
                                onChange={(e) => handleAddressChange("street", e.target.value)}
                                autoComplete="street-address"
                                helperText="e.g., 123 Main Street"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="unit-input"
                                label="Unit/Apt"
                                type="text"
                                value={address.unit}
                                onChange={(e) => handleAddressChange("unit", e.target.value)}
                                autoComplete="address-line2"
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                fullWidth
                                id="city-input"
                                label="City"
                                type="text"
                                value={address.city}
                                onChange={(e) => handleAddressChange("city", e.target.value)}
                                autoComplete="address-level2"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="state-input"
                                label="State/Province"
                                type="text"
                                value={address.state}
                                onChange={(e) => handleAddressChange("state", e.target.value)}
                                autoComplete="address-level1"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                id="zipCode-input"
                                label="Zip/Postal"
                                type="text"
                                inputProps={{maxLength: 10}}
                                value={address.zipCode}
                                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                                autoComplete="postal-code"
                            />
                        </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ textAlign: 'left', mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                            🔒 Your privacy matters
                        </Typography>
                        <Typography variant="body2">
                            Your address won't be public and is only visible to people you give access to through permission groups.
                        </Typography>
                    </Alert>

                    <LoadingButton
                        fullWidth
                        size="large"
                        variant="contained"
                        loading={loading}
                        disabled={firstName === "" || lastName === ""}
                        onClick={updateUser}
                        sx={{ py: 1.5, mt: 3 }}
                    >
                        {loading ? 'Saving...' : 'Continue'}
                    </LoadingButton>
                </Stack>
            </Box>
        </Box>
    ), [firstName, lastName, address, loading, handleFirstNameChange, handleLastNameChange, handleAddressChange, updateUser]);

    const CompletionStep = () => (
        <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" component="h2" gutterBottom>
                You're All Set!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Ready to start making connections
            </Typography>

            <Box sx={{ maxWidth: '500px', mx: 'auto', mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Next steps:</strong>
                </Typography>
                <Stack spacing={2} sx={{ textAlign: 'left' }}>
                    <Typography variant="body2">
                        • Create permission groups to control what information you share
                    </Typography>
                    <Typography variant="body2">
                        • Search for friends and family to connect with
                    </Typography>
                    <Typography variant="body2">
                        • Update your profile with contact details and personal info
                    </Typography>
                </Stack>
            </Box>

            <LoadingButton
                variant="contained"
                size="large"
                loading={loading}
                onClick={completeOnboarding}
                sx={{ px: 4, py: 1.5 }}
            >
                {loading ? 'Finishing...' : 'Enter Nevvi'}
            </LoadingButton>
        </Box>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <WelcomeStep />;
            case 1: return PersonalInfoStep;
            case 2: return <CompletionStep />;
            default: return <WelcomeStep />;
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Logo color="white" size={60} />
                </Box>

                <Paper
                    elevation={24}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    {!isMobile && (
                        <Box sx={{ p: 2 }}>
                            <Stepper
                                activeStep={currentStep}
                                alternativeLabel
                            >
                                {steps.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel>{step.label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    )}

                    <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                        {renderStep()}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default inject('accountStore')(observer(Onboarding));