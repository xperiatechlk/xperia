
import React from 'react'
import { Card, CardContent, Icon } from '@mui/material';
import theme from '../theme/Theme';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const CountCard = (props) => {
    const { icon, label, count } = props;
    return (
        <Card
            sx={{
                width: '100%',
                height: '120px',
                margin: '10px',
                marginBottom:'-20px',
                paddingRight: '10px', 
                borderRadius: '5px',
            }}>
            <CardContent>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '20px',
                    }}>
                    <div>
                        {icon}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                        }}>
                        <div
                            style={{
                                fontSize: '40px',
                                fontWeight: 'bold',
                                color: theme.palette.primary.main,
                            }}>
                            {count}
                        </div>
                        <div
                            style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}>
                            {label || 'loading ...' }
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default CountCard;