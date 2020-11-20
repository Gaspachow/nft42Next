import {Long} from "mongodb"

export interface User {
	_id: Long
	address: string
}