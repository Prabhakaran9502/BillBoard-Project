import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import axios from "axios";

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function UserActive(props) {

    const { sendToParent } = props;

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);

    React.useEffect(() => {
        setLeft(props.message.Table);
        setRight(props.message.Table1);
    }, []);


    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };


    const handleClickUpdate = () => {

        var leftvalue = "";
        left.forEach((item) => {
            leftvalue += (item.UserId) + ",";
        })

        let finalValue = leftvalue.slice(0, -1);

        const data = {
            LoginToken: localStorage.getItem('auth'),
            UpdatedId: finalValue
        }

        const url = 'https://localhost:44374/api/User/userEnableDisable';
        axios.post(url, data).then((result) => {
            const res = JSON.parse(result.data) ;

            if (res[0].Response == "Successfull") {
                sendToParent(false);
            }
            else {
                sendToParent(true);
            }
        })
            .catch((error) => {
                console.log(error);
            })
    };

    const handleClickCancel = () => {
        sendToParent(false);
    };




    const customList = (title, items) => (
        <Card>
            <CardHeader
                style={{ backgroundColor: '#808080', color: 'white' }}
                sx={{ px: 2, py: 1, color: 'white' }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                        style={{ color: 'white' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 200,
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = value.Name;

                    return (
                        <ListItemButton
                            key={value}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.Name} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <div>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList('Enabled', left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList('Disabled', right)}</Grid>
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, borderRadius: '30px' }}
                    onClick={handleClickUpdate}
                >
                    Update
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, ml: 2, borderRadius: '30px' }}
                    onClick={handleClickCancel}
                >
                    Cancel
                </Button>
            </Grid>
        </div>
    );
}
