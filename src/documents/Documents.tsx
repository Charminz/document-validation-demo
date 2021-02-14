import { Button, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { documentsTableColumns } from '../util/constants';
import { loadDocumentsByPage } from './DocumentActions';

type Props = {
	documents: Array<any>;
	paging: {
		page: number,
		pagesCount: number,
		perPage: number
	};
	actions: {
		loadDocumentsByPage: (pageNo: number) => void
	}
}

const useStyles = makeStyles({
	root: {
		maxWidth: "100vw",
		maxHeight: "100vh",
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	paper: {
		flex: 1,
		width: "90%"
	},
	tableContainer: {
		maxHeight: "90vh"
	}
})

const Documents = (props: Props) => {
	const classes = useStyles();
	useEffect(() => {
		console.log('MOUNTED, load data');
		props.actions.loadDocumentsByPage(1);
	}, []);

	const validateDocument = (document: any) => {
		console.log('validate', document);
	}

	const loadDocumentsPage = (_: any, pageNo: number) => {
		props.actions.loadDocumentsByPage(pageNo + 1);
	}

	const renderTableColumns = () => (
		<TableHead>
			<TableRow>
				{documentsTableColumns.map((column) => (
					<TableCell
						key={column.prop}
					>
						{column.label}
					</TableCell>
				))}
				<TableCell key="validation"/>
			</TableRow>
		</TableHead>
	);

	const renderTableData = () => (
		<TableBody>
			{props.documents.map((document) => {
				return (
					<TableRow hover role="checkbox" tabIndex={-1} key={document.id}>
						{documentsTableColumns.map((column) => {
							const value: string | number = document[column.prop] || "";

							return (
								<TableCell key={column.prop}>
									{value}
								</TableCell>
							)
						})}
						<TableCell key="validation" align="right">
							<Button
								onClick={() => validateDocument(document)}
								variant="outlined"
								color="primary"
							>
								Validate
							</Button>
						</TableCell>
					</TableRow>
				);
			})}
		</TableBody>
	);

	return (
		<div className={classes.root}>
			<h2>Documents </h2>
			<Paper className={classes.paper} elevation={8}>
				<TableContainer className={classes.tableContainer}>
					<Table stickyHeader>
						{renderTableColumns()}
						{renderTableData()}
					</Table>
				</TableContainer>
				<TablePagination
					component="div"
					count={props.paging.pagesCount * props.paging.perPage}
					rowsPerPage={props.paging.perPage}
					page={props.paging.page - 1}
					onChangePage={loadDocumentsPage}
				/>
			</Paper>
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	documents: state.documents.documents,
	paging: state.documents.paging
});

const mapDispatchToProps = (dispatch: any) => ({
	actions: bindActionCreators({
		loadDocumentsByPage
	}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
