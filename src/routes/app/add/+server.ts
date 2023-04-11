import { redirect } from "@sveltejs/kit"

export async function POST ({ request }): Promise<Response> {
	const data = await request.formData()
	const file = data.get("file") as File
	const fileContent = await file.text()
	const fileJson = JSON.parse(fileContent)

	console.log(fileJson)

	const dataUrl = data.get("url")
	const url = typeof dataUrl === "string" ? dataUrl : "/add"

	throw redirect(301, url)
}
