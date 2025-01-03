import { Box, styled, Button, OutlinedInput } from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import axios from 'axios';
import useInput from '../../../hooks/useInput';

const MainBox = styled(Box)`
    ${props => props.theme.breakpoints.up("xs")} {
        padding-top: 2em;
        min-width: 100%;
        display:flex;
        flex-direction:column;
        row-gap: 5px;
    }
    ${props => props.theme.breakpoints.up("md")} {
        padding-top: 2em;
        min-width: 100%;
        display: grid;
        grid-template-columns: 7fr 3fr;
        column-gap: 15px;
    }
    ${props => props.theme.breakpoints.up("lg")} {
        padding-top: 2em;
        min-width: 100%;
        display: grid;
        grid-template-columns: 7fr 2fr;
        column-gap: 15px;
    }
`;

const CustomTextField = styled(OutlinedInput)(() => ({
    border: 'none',
    "& fieldset": { border: 'none' },
    backgroundColor: "white",
    borderRadius: '10px',
    fontFamily: 'Montserrat',
    fontSize: '20px',
}));

export const CustomButton = styled(Button)(() => ({
    borderRadius: '10px',
    fontSize: '20px',
    textTransform: 'none',
    fontFamily: 'Righteous',
    background: 'linear-gradient(97.84deg, #5672FE -7.65%, #8562E9 106.37%)'
}));

function InputBox() {
    const path = useInput('');

    const handleDownload = async () => {
        if (!path.value) {
            console.error("URL is required");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/fetch-image', 
                { url: path.value }, 
                { headers: { 'Content-Type': 'application/json' }, responseType: 'arraybuffer' } // Указываем, что ожидаем бинарный ответ
            );

            console.log('Response data:', response.data);

            const contentType = response.headers['content-type'];
            if (contentType && contentType.startsWith('image/')) {
                const blob = new Blob([response.data], { type: contentType });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'downloaded_image.png';
                link.click();
            } else {
                console.error('Received non-image content:', response.data);
            }
        } catch (error) {
            console.error('Error downloading the image:', error.response?.data || error.message);
        }
    };

    return (
        <MainBox>
            <CustomTextField placeholder='Paste your link' {...path} />
            <CustomButton variant='contained' onClick={handleDownload}>
                Download
                <CloudDownloadOutlinedIcon />
            </CustomButton>
        </MainBox>
    );
}

export default InputBox;
