import React, { PropsWithChildren } from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

const styles = (theme: Theme) => ({
    root: {
        height: '30px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f30000',
        borderBottom: `1px solid ${theme.palette.grey[700]}`,
        color: theme.palette.getContrastText(theme.palette.grey.A400)
    }
});

interface Props extends PropsWithChildren<WithStyles<typeof styles>> {
    className?: string;
    style?: React.CSSProperties;
    text?: string;
}

const PromoBanner: React.SFC<Props> = (props) => {
    const {
        classes,
        className,
        children,
        text,
        ...other
    } = props;

    return (
        <div className={clsx(classes.root, className)} {...other}>
            {text}
        </div>
    );
};

export default withStyles(styles)(PromoBanner);