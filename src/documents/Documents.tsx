import {
	Button,
	CircularProgress,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { documentsTableColumns } from '../util/constants';
import { loadDocumentsByPage, validateDocument, validateDocuments } from './DocumentActions';
import type { Document, DocumentsValidity } from "../util/types";
import { isNil } from 'ramda';
import CheckIcon from '@material-ui/icons/Check';

type Props = {
	documents: Array<Document>,
	paging: {
		page: number,
		pagesCount: number,
		perPage: number
	},
	documentsValidity: DocumentsValidity,
	actions: {
		loadDocumentsByPage: (pageNo: number) => void,
		validateDocument: (documentId: string) => void,
		validateDocuments: (documents: Array<Document>) => void
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
	header: {
		width: "90%",
		display: "flex",
		justifyContent: "space-between",
		marginBottom: 20,
		alignItems: "center",
		paddingLeft: 10,
		paddingRight: 10
	},
	paper: {
		flex: 1,
		width: "90%"
	},
	tableContainer: {
		maxHeight: "85vh"
	},
	validationCell: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center"
	},
	progressIcon: {
		marginLeft: 5,
		marginRight: 5
	}
})

const Documents = (props: Props) => {
	const classes = useStyles();
	useEffect(() => {
		props.actions.loadDocumentsByPage(1);
	}, []);

	const validateDocument = (document: Document) => {
		props.actions.validateDocument(document.id)
	};

	const validateAllDocuments = () => {
		props.actions.validateDocuments(props.documents);
	}

	const loadDocumentsPage = (_: any, pageNo: number) => {
		props.actions.loadDocumentsByPage(pageNo + 1);
	};

	const renderProgress = (isValidated: boolean) => (
		isValidated
			? <CheckIcon className={classes.progressIcon} style={{ color: "green" }} />
			: <CircularProgress className={classes.progressIcon} size={24} />
	)

	const renderDocumentValidity = (documentId: string) => {
		if (isNil(props.documentsValidity[documentId])) return null;
		const { validationInProgress, checksumValid, schemaValid, signatureValid } = props.documentsValidity[documentId];
		
		if (!validationInProgress) {
			const isValid = checksumValid && schemaValid && signatureValid;
			return (
				<span style={{ marginRight: 15, color: isValid ? "green" : "red" }}>
					{isValid ? "Valid Document" : "Invalid Document"}
				</span>
			);
		}
		return (
			<div style={{ display: "flex" }}>
				{renderProgress(checksumValid)}
				{renderProgress(schemaValid)}
				{renderProgress(signatureValid)}
			</div>
		);
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
			{props.documents.map((document: Document) => (
				<TableRow hover role="checkbox" tabIndex={-1} key={document.id}>
					{documentsTableColumns.map((column) => {
						const value = document[column.prop] || "";

						return (
							<TableCell key={column.prop}>
								{value}
							</TableCell>
						)
					})}
					<TableCell
						key="validation"
						align="right"
						className={classes.validationCell}
					>
						{renderDocumentValidity(document.id)}
						<Button
							onClick={() => validateDocument(document)}
							variant="outlined"
							color="primary"
						>
							Validate
						</Button>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	);

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<h2>Documents </h2>
				<Button
					onClick={validateAllDocuments}
					variant="outlined"
					color="primary"
					style={{ height: 50 }}
				>
					Validate All
				</Button>
			</div>
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
	paging: state.documents.paging,
	documentsValidity: state.documents.validity
});

const mapDispatchToProps = (dispatch: any) => ({
	actions: bindActionCreators({
		loadDocumentsByPage,
		validateDocument,
		validateDocuments
	}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
